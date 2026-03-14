import type { IncomingMessage, ServerResponse } from "http";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const MAX_BODY_BYTES = 32_768; // 32KB — allows long textarea answers across 16 questions

const ALLOWED_ORIGINS: readonly string[] = [
  "https://avelix.io",
  "https://www.avelix.io",
  "https://final-agency-website.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function readBody(req: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    req.on("data", (chunk) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buf.length;
      if (totalBytes > maxBytes) {
        req.destroy();
        reject(new Error("Request body too large"));
        return;
      }
      chunks.push(buf);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Initialize Firebase Admin from individual env vars (modular API avoids admin.credential undefined in some runtimes)
function getFirestoreInstance(): ReturnType<typeof getFirestore> {
  if (!getApps()?.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

    if (!projectId) throw new Error("FIREBASE_PROJECT_ID env var is not set.");
    if (!clientEmail) throw new Error("FIREBASE_CLIENT_EMAIL env var is not set.");
    if (!privateKey) throw new Error("FIREBASE_PRIVATE_KEY env var is not set.");

    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }

  return getFirestore();
}

type AnyObject = Record<string, unknown>;

interface QuestionnairePayload {
  lead?: {
    name?: string;
    email?: string;
  };
  answers?: AnyObject;
  meta?: AnyObject;
}

/** Remove undefined values so Firestore accepts the document (it rejects undefined). */
function sanitizeForFirestore(obj: AnyObject): AnyObject {
  const out: AnyObject = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = sanitizeForFirestore(v as AnyObject);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function getAllowedOrigin(req: IncomingMessage): string {
  const origin = (req as any).headers?.origin ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
}

function setCors(req: IncomingMessage, res: ServerResponse & { setHeader: (name: string, value: string) => void }) {
  res.setHeader("Access-Control-Allow-Origin", getAllowedOrigin(req));
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  setCors(req, res);

  try {
    const method = (req.method || "").toUpperCase();
    if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    /* ---------- Origin check ---------- */
    const origin = (req as any).headers?.origin ?? "";
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Forbidden" }));
      return;
    }

    if (method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Method not allowed",
          message: "This endpoint accepts POST only. Submit the questionnaire form to use it.",
        })
      );
      return;
    }

    // Vercel may attach parsed body to req.body; fallback: read from request stream.
    let payload: QuestionnairePayload | undefined = (req as any).body;
    if (!payload || typeof payload !== "object") {
      const raw =
        typeof (req as any).body === "string"
          ? (req as any).body
          : await readBody(req as IncomingMessage, MAX_BODY_BYTES);
      if (raw && raw.trim()) {
        try {
          payload = JSON.parse(raw) as QuestionnairePayload;
        } catch {
          payload = undefined;
        }
      }
    }
    if (!payload || typeof payload !== "object") {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing request body" }));
      return;
    }

    const lead = payload.lead ?? {};
    const answers = payload.answers ?? {};

    const name = typeof lead.name === "string" ? lead.name.trim() : "";
    const email = typeof lead.email === "string" ? lead.email.trim() : "";

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !EMAIL_PATTERN.test(email)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Lead name and email are required.",
        })
      );
      return;
    }

    if (typeof answers !== "object" || answers === null) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "answers must be an object.",
        })
      );
      return;
    }

    let firestore: ReturnType<typeof getFirestore>;
    try {
      firestore = getFirestoreInstance();
    } catch (initErr: unknown) {
      const msg = initErr instanceof Error ? initErr.message : String(initErr);
      console.error("Firebase init error:", msg);
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Service temporarily unavailable.",
          code: "FIREBASE_INIT",
          message: msg,
        })
      );
      return;
    }

    const forwardedFor = (req as any).headers?.["x-forwarded-for"];
    const ip = typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : null;
    const userAgent =
      (payload.meta as AnyObject | undefined)?.userAgent ??
      (req as any).headers?.["user-agent"] ??
      null;

    const sanitized = sanitizeForFirestore({
      lead: { name, email },
      answers,
      meta: {
        ...(payload.meta && typeof payload.meta === "object" ? payload.meta : {}),
        ip: ip ?? null,
        userAgent: userAgent ?? null,
      },
    });
    const docData = { ...sanitized, leadQuality: "Warm" };

    let docId: string;
    try {
      const docRef = await firestore.collection("QUESTIONNAIRE_LEADS").add(docData);
      docId = docRef.id;
    } catch (writeErr: unknown) {
      const msg = writeErr instanceof Error ? writeErr.message : String(writeErr);
      console.error("Firestore write error:", msg, writeErr);
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Could not save your response.",
          code: "FIRESTORE_WRITE",
          message: msg,
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, docId }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error handling questionnaire-lead:", message, err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal server error while saving questionnaire lead.",
        code: "SERVER_ERROR",
        message,
      })
    );
  }
}


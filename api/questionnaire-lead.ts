import type { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";

/** Read raw body from request stream (fallback when req.body is not set, e.g. on some Vercel runtimes). */
function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Initialize Firebase Admin with service account from environment
function getFirestore(): admin.firestore.Firestore {
  if (!admin.apps?.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson || typeof serviceAccountJson !== "string") {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var is not set.");
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(serviceAccountJson) as Record<string, unknown>;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }

    const required = ["type", "project_id", "private_key_id", "private_key", "client_email"];
    const missing = required.filter((k) => !parsed[k] || typeof parsed[k] !== "string");
    if (missing.length) {
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON missing or invalid: ${missing.join(", ")}. Paste the full JSON from Firebase.`);
    }

    // Ensure private_key has real newlines (env vars often store \n as literal backslash-n)
    if (typeof parsed.private_key === "string" && parsed.private_key.includes("\\n")) {
      parsed = { ...parsed, private_key: parsed.private_key.replace(/\\n/g, "\n") };
    }

    const serviceAccount = parsed as admin.ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || (parsed.project_id as string) || undefined,
    });
  }

  return admin.firestore();
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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: ServerResponse & { setHeader: (name: string, value: string) => void }) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  setCors(res);

  try {
    const method = (req.method || "").toUpperCase();
    if (method === "OPTIONS") {
      res.statusCode = 200;
      res.end();
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
          : await readBody(req as IncomingMessage);
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

    if (!name || !email) {
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

    let firestore: admin.firestore.Firestore;
    try {
      firestore = getFirestore();
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

    const docData = sanitizeForFirestore({
      lead: { name, email },
      answers,
      meta: {
        ...(payload.meta && typeof payload.meta === "object" ? payload.meta : {}),
        ip: ip ?? null,
        userAgent: userAgent ?? null,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    try {
      await firestore.collection("QUESTIONNAIRE_LEADS").add(docData);
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
    res.end(JSON.stringify({ ok: true }));
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


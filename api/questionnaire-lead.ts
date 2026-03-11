import type { IncomingMessage, ServerResponse } from "http";
import * as admin from "firebase-admin";

// Initialize Firebase Admin with service account from environment
function getFirestore() {
  if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON env var is not set. It must contain the full service account JSON."
      );
    }

    let serviceAccount: admin.ServiceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (err) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Please paste the exact service account JSON."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Prefer explicit project ID from env; otherwise let the credential determine it.
      projectId: process.env.FIREBASE_PROJECT_ID,
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

    // Vercel may attach parsed body to req.body; fallback to parsing raw body.
    let payload: QuestionnairePayload | undefined = (req as any).body;
    if (!payload && typeof (req as any).body === "string") {
      try {
        payload = JSON.parse((req as any).body) as QuestionnairePayload;
      } catch {
        payload = undefined;
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

    const firestore = getFirestore();

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

    await firestore.collection("QUESTIONNAIRE_LEADS").add(docData);

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
        ...(process.env.NODE_ENV !== "production" && { detail: message }),
      })
    );
  }
}


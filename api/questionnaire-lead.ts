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

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    // In Vercel's Node runtime, body is already parsed for TS/JS handlers.
    const payload = (req as any).body as QuestionnairePayload | undefined;

    if (!payload) {
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

    const now = admin.firestore.FieldValue.serverTimestamp();

    const docData = {
      lead: {
        name,
        email,
      },
      answers,
      meta: {
        ...(payload.meta ?? {}),
        ip: (req as any).headers?.["x-forwarded-for"] || (req as any).socket?.remoteAddress || null,
        userAgent: (payload.meta as AnyObject | undefined)?.userAgent ?? (req as any).headers?.["user-agent"] ?? null,
      },
      createdAt: now,
    };

    await firestore.collection("QUESTIONNAIRE_LEADS").add(docData);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (err: any) {
    console.error("Error handling questionnaire-lead:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal server error while saving questionnaire lead.",
      })
    );
  }
}


import type { IncomingMessage, ServerResponse } from "http";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ALLOWED_ORIGINS: readonly string[] = [
  "https://avelix.io",
  "https://www.avelix.io",
  "https://final-agency-website.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getFirebaseAdmin() {
  if (!getApps()?.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin env vars not configured.");
    }
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }
  return { auth: getAuth(), firestore: getFirestore() };
}

function getAllowedOrigin(req: IncomingMessage): string {
  const origin = (req as any).headers?.origin ?? "";
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function setCors(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", getAllowedOrigin(req));
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

export default async function handler(
  req: IncomingMessage & { method?: string },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  setCors(req, res as ServerResponse);

  const method = (req.method ?? "").toUpperCase();
  if (method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  if (method !== "GET") { sendJson(res, 405, { error: "GET only" }); return; }

  /* ---------- Origin check ---------- */
  const origin = (req as any).headers?.origin ?? "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  /* ---------- Verify Firebase ID token ---------- */
  const authHeader = (req as any).headers?.authorization ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken) {
    sendJson(res, 401, { error: "Missing Authorization header" });
    return;
  }

  let admin: ReturnType<typeof getFirebaseAdmin>;
  try {
    admin = getFirebaseAdmin();
  } catch (err) {
    console.error("Firebase init:", err);
    sendJson(res, 503, { error: "Service unavailable" });
    return;
  }

  let uid: string;
  try {
    const decoded = await admin.auth.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    sendJson(res, 401, { error: "Invalid or expired token" });
    return;
  }

  /* ---------- Find questionnaire doc linked to this UID ---------- */
  try {
    const snapshot = await admin.firestore
      .collection("QUESTIONNAIRE_LEADS")
      .where("analysisUid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      sendJson(res, 404, { error: "No analysis found for this account" });
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    sendJson(res, 200, {
      ok: true,
      docId: doc.id,
      hasAnalysis: data.freeAnalysisUsed === true && !!data.freeAnalysisResult,
    });
  } catch (err) {
    console.error("Lookup error:", err);
    sendJson(res, 500, { error: "Internal server error" });
  }
}

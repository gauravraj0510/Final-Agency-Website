import type { IncomingMessage, ServerResponse } from "http";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

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

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function setCors(res: ServerResponse) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/* ------------------------------------------------------------------ */
/*  Gemini structured output schema                                   */
/* ------------------------------------------------------------------ */

const analysisResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    overallScore: {
      type: SchemaType.NUMBER,
      description: "Overall automation readiness score out of 10",
    },
    diagnosis: {
      type: SchemaType.STRING,
      description: "2-3 sentence operational diagnosis summary",
    },
    dimensions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, description: "Dimension name e.g. Revenue Automation" },
          score: { type: SchemaType.NUMBER, description: "Score out of 10" },
          verdict: { type: SchemaType.STRING, description: "One-line verdict for this dimension" },
        },
        required: ["name", "score", "verdict"],
      },
      description: "Scores across 5 business dimensions",
    },
    topOpportunities: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: "Opportunity name" },
          description: { type: SchemaType.STRING, description: "One sentence description" },
          impact: { type: SchemaType.STRING, description: "Expected impact e.g. Save 15-25 hrs/week" },
        },
        required: ["title", "description", "impact"],
      },
      description: "Top 3 automation opportunities (keep brief — detailed report is paid)",
    },
    criticalBottleneck: {
      type: SchemaType.STRING,
      description: "The single biggest bottleneck identified, one sentence",
    },
  },
  required: ["overallScore", "diagnosis", "dimensions", "topOpportunities", "criticalBottleneck"],
};

/* ------------------------------------------------------------------ */
/*  Handler                                                           */
/* ------------------------------------------------------------------ */

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data?: string) => void;
  }
) {
  setCors(res as ServerResponse);

  const method = (req.method ?? "").toUpperCase();
  if (method === "OPTIONS") { res.statusCode = 200; res.end(); return; }
  if (method !== "POST") { sendJson(res, 405, { error: "POST only" }); return; }

  /* ---------- Parse body ---------- */
  let body: { docId?: string } | undefined = (req as any).body;
  if (!body || typeof body !== "object") {
    const raw = typeof (req as any).body === "string" ? (req as any).body : await readBody(req);
    try { body = JSON.parse(raw); } catch { body = undefined; }
  }
  const docId = body?.docId;
  if (!docId || typeof docId !== "string") {
    sendJson(res, 400, { error: "docId is required" });
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

  /* ---------- Fetch questionnaire doc ---------- */
  const docRef = admin.firestore.collection("QUESTIONNAIRE_LEADS").doc(docId);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    sendJson(res, 404, { error: "Questionnaire not found" });
    return;
  }
  const docData = docSnap.data()!;

  /* ---------- If this doc already has a cached analysis, return it ---------- */
  if (docData.freeAnalysisUsed === true && docData.freeAnalysisResult) {
    if (docData.analysisUid !== uid) {
      sendJson(res, 403, { error: "This questionnaire is linked to another account" });
      return;
    }
    sendJson(res, 200, { ok: true, analysis: docData.freeAnalysisResult, cached: true });
    return;
  }

  /* ---------- One-time guard: check if this UID already used free analysis on another doc ---------- */
  if (docData.analysisUid && docData.analysisUid !== uid) {
    sendJson(res, 403, { error: "This questionnaire is linked to another account" });
    return;
  }

  const existingUsage = await admin.firestore
    .collection("QUESTIONNAIRE_LEADS")
    .where("analysisUid", "==", uid)
    .where("freeAnalysisUsed", "==", true)
    .limit(1)
    .get();

  if (!existingUsage.empty) {
    sendJson(res, 409, {
      error: "You have already used your free analysis. Book a call for a detailed report.",
      code: "ALREADY_USED",
    });
    return;
  }

  /* ---------- Call Gemini (server-side, API key never exposed) ---------- */
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiKey) {
    sendJson(res, 503, { error: "AI service not configured" });
    return;
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: analysisResponseSchema,
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
  });

  const answers = docData.answers ?? {};
  const prompt = `You are an AI business automation consultant for Avelix, an AI consultancy.

Analyze these questionnaire answers and provide a BRIEF operational assessment.
Keep it concise — this is a free preview. The detailed report is a paid service.

QUESTIONNAIRE ANSWERS:
${JSON.stringify(answers, null, 2)}

RULES:
- Score each of the 5 dimensions (Revenue Automation, Operations Automation, Data Intelligence, Systems Integration, Scalability Readiness) from 1-10
- Overall score is the average
- Diagnosis should be 2-3 sentences identifying the core issue
- List exactly 3 top automation opportunities with brief descriptions and impact estimates
- Identify the single critical bottleneck
- Keep everything concise and actionable — no fluff
- Do NOT give a full detailed roadmap — that is the paid tier`;

  let analysis: Record<string, unknown>;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    analysis = JSON.parse(text);
  } catch (err) {
    console.error("Gemini error:", err);
    sendJson(res, 502, { error: "AI analysis failed. Please try again." });
    return;
  }

  /* ---------- Mark as used, link UID, upgrade lead quality ---------- */
  await docRef.update({
    analysisUid: uid,
    freeAnalysisUsed: true,
    freeAnalysisResult: analysis,
    freeAnalysisAt: FieldValue.serverTimestamp(),
    leadQuality: "Hot",
  });

  sendJson(res, 200, { ok: true, analysis });
}

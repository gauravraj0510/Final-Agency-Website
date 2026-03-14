import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, getIdToken } from "../lib/firebase-client";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE =
  typeof import.meta.env?.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "https://final-agency-website.vercel.app";

const CALENDLY_URL =
  typeof import.meta.env?.VITE_CALENDLY_URL === "string" &&
  import.meta.env.VITE_CALENDLY_URL
    ? import.meta.env.VITE_CALENDLY_URL
    : "https://calendly.com/avelix";

/* ------------------------------------------------------------------ */
/*  Types matching the Gemini structured output                       */
/* ------------------------------------------------------------------ */

interface Dimension {
  name: string;
  score: number;
  verdict: string;
}

interface Opportunity {
  title: string;
  description: string;
  impact: string;
}

interface AnalysisResult {
  overallScore: number;
  diagnosis: string;
  dimensions: Dimension[];
  topOpportunities: Opportunity[];
  criticalBottleneck: string;
}

type PageState = "loading" | "ready" | "error" | "auth-required";

/* ------------------------------------------------------------------ */
/*  Small visual components                                           */
/* ------------------------------------------------------------------ */

const ScoreRing: React.FC<{ score: number; size?: number }> = ({
  score,
  size = 140,
}) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color =
    score >= 7
      ? "#22c55e"
      : score >= 4
        ? "#eab308"
        : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
        <span className="text-[10px] text-white/50 uppercase tracking-wider">
          / 10
        </span>
      </div>
    </div>
  );
};

const DimensionBar: React.FC<{ dim: Dimension; index: number }> = ({
  dim,
  index,
}) => {
  const pct = (dim.score / 10) * 100;
  const color =
    dim.score >= 7
      ? "from-green-500 to-emerald-400"
      : dim.score >= 4
        ? "from-yellow-500 to-amber-400"
        : "from-red-500 to-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/90">{dim.name}</span>
        <span className="text-sm font-semibold text-white">{dim.score}/10</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + index * 0.1 }}
        />
      </div>
      <p className="text-xs text-white/50">{dim.verdict}</p>
    </motion.div>
  );
};

const OpportunityCard: React.FC<{ opp: Opportunity; index: number }> = ({
  opp,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 + index * 0.15 }}
    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2"
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold">
        {index + 1}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">{opp.title}</h3>
        <p className="text-xs text-white/60 leading-relaxed">{opp.description}</p>
      </div>
    </div>
    <div className="ml-10 inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1">
      <span className="text-[11px] font-medium text-green-400">
        {opp.impact}
      </span>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Loading animation                                                 */
/* ------------------------------------------------------------------ */

const LOADING_STEPS = [
  "Reading your responses...",
  "Mapping business operations...",
  "Scoring automation dimensions...",
  "Identifying bottlenecks...",
  "Generating recommendations...",
  "Building your snapshot...",
];

const AnalysisLoader: React.FC = () => {
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-10 text-center">
        {/* Animated rings */}
        <div className="relative mx-auto" style={{ width: 120, height: 120 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-purple-500/30"
              style={{ margin: i * 10 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#pulse-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
        </div>

        {/* Animated step text */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-white/80 font-medium"
            >
              {LOADING_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {LOADING_STEPS.map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full"
                animate={{
                  width: i <= stepIndex ? 20 : 6,
                  backgroundColor:
                    i <= stepIndex
                      ? "rgba(168, 85, 247, 0.8)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Skeleton preview cards */}
        <div className="space-y-3 opacity-30">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-12 rounded-xl bg-white/5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <p className="text-[11px] text-white/30">
          Our AI is analyzing your business across 5 dimensions
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main dashboard component                                          */
/* ------------------------------------------------------------------ */

const AnalysisDashboard: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setPageState("error");
      setErrorMsg("Missing assessment ID.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setPageState("auth-required");
        return;
      }
      void fetchAnalysis();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  const fetchAnalysis = async () => {
    setPageState("loading");
    setErrorMsg(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/api/generate-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ docId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error response:", JSON.stringify(data));
        if (data?.code === "ALREADY_USED" && data?.error) {
          setErrorMsg(data.error);
          setPageState("error");
          return;
        }
        throw new Error(data?.debug ?? data?.error ?? `Request failed (${res.status})`);
      }

      setAnalysis(data.analysis as AnalysisResult);
      setPageState("ready");
    } catch (err) {
      console.error("Analysis fetch error:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load analysis."
      );
      setPageState("error");
    }
  };

  /* ---------- Auth required ---------- */
  if (pageState === "auth-required") {
    return (
      <Shell>
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold">Sign in required</h1>
          <p className="text-sm text-white/60">
            Please sign in from the questionnaire page to view your analysis.
          </p>
          <button
            type="button"
            onClick={() => navigate("/questionnaire")}
            className="btn-primary"
          >
            Go to questionnaire
          </button>
        </div>
      </Shell>
    );
  }

  /* ---------- Loading ---------- */
  if (pageState === "loading") {
    return <AnalysisLoader />;
  }

  /* ---------- Error ---------- */
  if (pageState === "error") {
    return (
      <Shell>
        <div className="text-center space-y-4 py-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-semibold">{errorMsg ?? "Something went wrong"}</h1>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => window.open(CALENDLY_URL, "_blank", "noopener")}
              className="btn-primary"
            >
              Book a detailed consultation
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline"
            >
              Back to home
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---------- Dashboard ---------- */
  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10 md:py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80">
            AI Operational Assessment
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Your Automation Snapshot
          </h1>
          <p className="text-sm text-white/50">
            Free preview — detailed roadmap available with a paid consultation
          </p>
        </motion.div>

        {/* Overall score + diagnosis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
        >
          <ScoreRing score={analysis.overallScore} />
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-lg font-semibold">Automation Readiness</h2>
            <p className="text-sm text-white/70 leading-relaxed">
              {analysis.diagnosis}
            </p>
          </div>
        </motion.div>

        {/* Dimension scores */}
        <div className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8 space-y-5">
          <h2 className="text-base font-semibold text-white/90 uppercase tracking-wider text-xs">
            Dimension Scores
          </h2>
          {analysis.dimensions.map((dim, i) => (
            <DimensionBar key={dim.name} dim={dim} index={i} />
          ))}
        </div>

        {/* Top opportunities */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-white/90 uppercase tracking-wider">
            Top Automation Opportunities
          </h2>
          {analysis.topOpportunities.map((opp, i) => (
            <OpportunityCard key={opp.title} opp={opp} index={i} />
          ))}
        </div>

        {/* Critical bottleneck */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2"
        >
          <h2 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Critical Bottleneck
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            {analysis.criticalBottleneck}
          </p>
        </motion.div>

        {/* Upsell CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="glass-dark rounded-3xl border border-purple-500/20 p-6 md:p-8 text-center space-y-4"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            Want the full picture?
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-lg mx-auto">
            This is a high-level snapshot. Our detailed AI audit includes
            process maps, automation architecture, ROI projections, and a
            step-by-step implementation roadmap tailored to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => window.open(CALENDLY_URL, "_blank", "noopener")}
              className="btn-primary"
            >
              Book a free strategy call
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline"
            >
              Back to home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* Shared layout shell for non-dashboard states */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
    <div className="max-w-xl w-full glass-dark rounded-3xl border border-white/10 px-6 py-8 md:px-10 md:py-10">
      {children}
    </div>
  </div>
);

export default AnalysisDashboard;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "../questionnaire/questions";
import { auth, signInWithGoogle, handleRedirectResult } from "../lib/firebase-client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navigation from "../components/Navigation";
import { useDocumentMeta } from "../lib/useDocumentMeta";

const API_BASE =
  typeof import.meta.env?.VITE_API_BASE_URL === "string" && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "https://final-agency-website.vercel.app";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

type StepState = "idle" | "submitting" | "success" | "error";
type PostSubmitState = "offer" | "signing-in" | "sign-in-error";

/* Decorative background — matches homepage "Meet the Visionaries" section */
const PageBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Purple gradient orb — top-left */}
    <div
      className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
      style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: '10%', left: '-10%' }}
    />
    {/* Violet orb — bottom-right */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', bottom: '20%', right: '-5%' }}
    />
    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
    {/* Top glow accent */}
    <div className="absolute top-[-10%] left-[20%] right-[20%] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
  </div>
);

const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepState, setStepState] = useState<StepState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [postSubmitState, setPostSubmitState] = useState<PostSubmitState>("offer");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser);
  const [existingAnalysisDocId, setExistingAnalysisDocId] = useState<string | null>(null);

  useDocumentMeta({
    title: "Free AI Operational Assessment — Avelix",
    description:
      "Take our free 5-minute AI Operational Assessment. Get a personalized AI adoption snapshot report with high-impact automation opportunities and a clear action plan.",
    canonical: "https://avelix.io/questionnaire",
  });

  /* Track auth state and check for existing analysis */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      if (user) {
        void checkExistingAnalysis();
      } else {
        setExistingAnalysisDocId(null);
      }
    });
    return unsubscribe;
  }, []);

  const checkExistingAnalysis = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/lookup-analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && data.docId && data.hasAnalysis) {
        setExistingAnalysisDocId(data.docId);
      }
    } catch {
      // silently fail
    }
  };

  /* Handle redirect sign-in return (when popup was blocked by COOP) */
  useEffect(() => {
    void handleRedirectResult().then((user) => {
      if (user) {
        const savedDocId = sessionStorage.getItem("avelix_docId");
        if (savedDocId) {
          sessionStorage.removeItem("avelix_docId");
          navigate(`/analysis/${savedDocId}`);
        }
      }
    });
  }, [navigate]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const progressPercent = useMemo(
    () => Math.round(((currentIndex + 1) / totalQuestions) * 100),
    [currentIndex, totalQuestions]
  );

  const handleChange = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultiToggle = (value: string) => {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.id];
      const currentArray: string[] = Array.isArray(existing)
        ? existing
        : existing
        ? [existing]
        : [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [currentQuestion.id]: currentArray.filter((v) => v !== value),
        };
      }
      return {
        ...prev,
        [currentQuestion.id]: [...currentArray, value],
      };
    });
  };

  const validateCurrent = (): boolean => {
    if (!currentQuestion.required) return true;
    const raw = answers[currentQuestion.id];

    if (currentQuestion.type === "multi-select") {
      const arr: string[] = Array.isArray(raw)
        ? raw
        : raw
        ? [String(raw)]
        : [];
      const otherKey = `${currentQuestion.id}__other`;
      const otherVal = (answers[otherKey] as string | undefined)?.trim?.() ?? "";
      const detailVal =
        currentQuestion.id === "leadFollowup"
          ? (answers["leadFollowup_details"] as string | undefined)?.trim?.() ?? ""
          : "";
      return arr.length > 0 || otherVal.length > 0 || detailVal.length > 0;
    }

    if (currentQuestion.type === "single-select") {
      const optionSelected = typeof raw === "string" && raw.length > 0;
      const otherKey = `${currentQuestion.id}__other`;
      const otherVal = (answers[otherKey] as string | undefined)?.trim?.() ?? "";
      return optionSelected || otherVal.length > 0;
    }

    const str = (raw ?? "") as string;
    const value = str.trim();
    if (!value) return false;
    if (currentQuestion.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrent()) {
      setErrorMessage(
        currentQuestion.type === "email"
          ? "Please enter a valid email to continue."
          : "This question is required."
      );
      return;
    }
    setErrorMessage(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const goBack = () => {
    setErrorMessage(null);
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (stepState === "idle") {
        if (currentIndex === totalQuestions - 1) {
          void handleSubmit();
        } else {
          goNext();
        }
      }
    }
  };

  const getNormalizedAnswers = (): Record<string, string | string[]> => {
    const out: Record<string, string | string[]> = {};
    questions.forEach((q) => {
      const id = q.id;
      const main = answers[id];
      const otherKey = `${id}__other`;
      const other = answers[otherKey] as string | undefined;
      const otherVal = typeof other === "string" ? other.trim() : "";
      if (q.type === "single-select") {
        const optionVal = typeof main === "string" ? main : "";
        out[id] = optionVal || otherVal;
      } else if (q.type === "multi-select") {
        const arr = Array.isArray(main) ? main : typeof main === "string" && main ? [main] : [];
        out[id] = otherVal ? [...arr, otherVal] : arr;
      } else {
        out[id] = (typeof main === "string" ? main : Array.isArray(main) ? main : "") as string | string[];
      }
    });
    if (answers.leadFollowup_details !== undefined) {
      out.leadFollowup_details = String(answers.leadFollowup_details);
    }
    return out;
  };

  const handleSubmit = async () => {
    if (!validateCurrent()) {
      setErrorMessage("Please complete this question before submitting.");
      return;
    }
    setErrorMessage(null);
    setStepState("submitting");
    try {
      const lead = {
        name: answers["name"] ?? "",
        email: answers["email"] ?? "",
      };

      const normalizedAnswers = getNormalizedAnswers();

      const payload = {
        lead,
        answers: normalizedAnswers,
        meta: {
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          submittedAtClient: new Date().toISOString(),
        },
      };

      const res = await fetch(`${API_BASE}/api/questionnaire-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let apiMessage = `Request failed with status ${res.status}`;
        try {
          const data = await res.json();
          if (data?.message) apiMessage = data.message;
          else if (data?.error) apiMessage = data.error;
          if (data?.code) apiMessage = `[${data.code}] ${apiMessage}`;
        } catch {
          // ignore if response isn't JSON
        }
        throw new Error(apiMessage);
      }

      const data = await res.json();
      if (data?.docId) setDocId(data.docId);

      setStepState("success");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong while saving your responses. Please try again in a moment.";
      setErrorMessage(message);
      setStepState("error");
    }
  };

  const handleSingleSelect = (value: string) => {
    const otherKey = `${currentQuestion.id}__other`;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
      [otherKey]: "",
    }));
  };

  const renderField = () => {
    const raw = answers[currentQuestion.id];
    const singleValue = (typeof raw === "string" ? raw : "") ?? "";

    if (currentQuestion.type === "single-select" && currentQuestion.options) {
      const selectedValue = typeof raw === "string" ? raw : "";
      const optionValues = currentQuestion.options.map((o) => o.value);
      const optionSelected = optionValues.includes(selectedValue);
      const otherKey = `${currentQuestion.id}__other`;
      const otherVal = (answers[otherKey] as string | undefined) ?? "";
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (selectedValue === opt.value) {
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: "",
                      [otherKey]: "",
                    }));
                  } else {
                    handleSingleSelect(opt.value);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                  selectedValue === opt.value
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-purple-400/60"
                }`}
              >
                <span className="text-sm text-white/90">{opt.label}</span>
              </button>
            ))}
          </div>
          {currentQuestion.allowOtherText && (
            <div className="space-y-1">
              <label className="text-xs text-white/60">
                Other (if none of the above)
              </label>
              <input
                type="text"
                disabled={optionSelected}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type your own answer"
                value={otherVal}
                onChange={(e) => {
                  const v = e.target.value;
                  setAnswers((prev) => ({
                    ...prev,
                    [otherKey]: v,
                    ...(v ? { [currentQuestion.id]: "" } : {}),
                  }));
                }}
              />
            </div>
          )}
        </div>
      );
    }

    if (currentQuestion.type === "multi-select" && currentQuestion.options) {
      const selectedValues: string[] = Array.isArray(raw)
        ? raw
        : raw
        ? [String(raw)]
        : [];
      const otherKey = `${currentQuestion.id}__other`;
      const otherVal = (answers[otherKey] as string | undefined) ?? "";

      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isActive = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleMultiToggle(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                    isActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/10 hover:border-purple-400/60"
                  }`}
                >
                  <span className="text-sm text-white/90">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {currentQuestion.allowOtherText && (
            <div className="space-y-1">
              <label className="text-xs text-white/60">
                Other (optional, if nothing above fits)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent"
                placeholder="Type your own answer"
                value={otherVal}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [otherKey]: e.target.value,
                  }))
                }
              />
            </div>
          )}
          {currentQuestion.id === "leadFollowup" && (
            <div className="space-y-1">
              <label className="text-xs text-white/60">
                Add a bit more detail (optional)
              </label>
              <textarea
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent min-h-[80px] resize-vertical"
                placeholder="E.g. We follow up manually on WhatsApp and update deals in our CRM once a week…"
                value={
                  (answers["leadFollowup_details"] as string | undefined) ?? ""
                }
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    leadFollowup_details: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>
      );
    }

    if (currentQuestion.type === "textarea") {
      return (
        <textarea
          className="w-full mt-4 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent min-h-[140px] resize-vertical"
          placeholder={currentQuestion.placeholder}
          value={singleValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    }

    return (
      <input
        type={currentQuestion.type === "email" ? "email" : "text"}
        className="w-full mt-4 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent"
        placeholder={currentQuestion.placeholder}
        value={singleValue}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  };

  const handleSwitchAccount = async () => {
    setPostSubmitState("signing-in");
    setSignInError(null);
    try {
      // Sign out current account
      await signOut(auth);

      // Persist docId for redirect fallback
      if (docId) sessionStorage.setItem("avelix_docId", docId);

      // Sign in with new account
      const user = await signInWithGoogle();
      if (user) {
        sessionStorage.removeItem("avelix_docId");
        navigate(`/analysis/${docId}`);
      }
      // If null, redirect was triggered — page will reload
    } catch (err) {
      console.error("Account switch failed:", err);
      sessionStorage.removeItem("avelix_docId");
      setSignInError(
        err instanceof Error ? err.message : "Account switch failed. Please try again."
      );
      setPostSubmitState("offer");
    }
  };

  const handleSignInAndAnalyze = async () => {
    setPostSubmitState("signing-in");
    setSignInError(null);

    // If already signed in, skip sign-in and go straight to analysis
    if (auth.currentUser) {
      navigate(`/analysis/${docId}`);
      return;
    }

    try {
      // Persist docId so it survives a redirect-based sign-in
      if (docId) sessionStorage.setItem("avelix_docId", docId);

      const user = await signInWithGoogle();
      if (user) {
        // Popup succeeded — navigate immediately
        sessionStorage.removeItem("avelix_docId");
        navigate(`/analysis/${docId}`);
      }
      // If user is null, redirect was triggered — page will reload
    } catch (err) {
      console.error("Google sign-in failed:", err);
      sessionStorage.removeItem("avelix_docId");
      setSignInError(
        err instanceof Error ? err.message : "Sign-in failed. Please try again."
      );
      setPostSubmitState("sign-in-error");
    }
  };

  if (stepState === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 relative">
        <PageBackground />
        <Navigation />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 max-w-xl w-full space-y-6 glass-dark rounded-3xl border border-purple-500/20 px-6 py-8 md:px-10 md:py-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80">
            AI Operational Assessment
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Assessment received.
          </h1>
          {/* Already-used notice for signed-in users */}
          {isSignedIn && existingAnalysisDocId ? (
            <>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <p className="text-sm text-amber-200/90 font-medium">
                  Your responses have been saved. However, you've already used your free analysis with this account.
                </p>
                <p className="text-xs text-white/50">
                  Sign out and use a different Google account to get a new free analysis of this submission, or view your existing report below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/analysis/${existingAnalysisDocId}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition"
                >
                  View old report
                </button>
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  disabled={postSubmitState === "signing-in"}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {postSubmitState === "signing-in" ? "Switching..." : "Use different account"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-white/70 leading-relaxed">
                {isSignedIn
                  ? "Want to see a quick AI-powered analysis of your answers? Your free operational snapshot is ready."
                  : "Want to see a quick AI-powered analysis of your answers? Sign in with Google to unlock your free operational snapshot."}
              </p>

              {signInError && (
                <p className="text-xs text-red-400">{signInError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSignInAndAnalyze}
                  disabled={!docId || postSubmitState === "signing-in"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!isSignedIn && (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {isSignedIn
                    ? "View my snapshot"
                    : postSubmitState === "signing-in"
                      ? "Signing in..."
                      : "Sign in with Google"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
                >
                  No thanks, go home
                </button>
              </div>

              <p className="text-[11px] text-white/40 leading-relaxed">
                One free analysis per account. Sign in to verify your identity.
              </p>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 relative"
      onKeyDown={handleKeyDown}
    >
      <PageBackground />
      <Navigation />
      <div className="relative z-10 max-w-2xl w-full space-y-6">
        {/* Header / progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80">
              AI Operational Assessment
            </p>
            <p className="text-xs text-white/60">
              Step {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass-dark rounded-3xl border border-white/10 px-6 py-7 md:px-8 md:py-9 shadow-xl shadow-black/40"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-purple-300/80 uppercase tracking-[0.25em]">
                  {currentQuestion.section}
                </p>
                <h1 className="text-xl md:text-2xl font-semibold leading-snug">
                  {currentQuestion.title}
                </h1>
                {currentQuestion.helper && (
                  <p className="text-sm text-white/65">
                    {currentQuestion.helper}
                  </p>
                )}
              </div>

              <div className="mt-4">{renderField()}</div>

              {errorMessage && (
                <p className="mt-3 text-xs text-red-400">{errorMessage}</p>
              )}

              {/* Controls */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentIndex === 0 || stepState === "submitting"}
                  className="text-xs md:text-sm text-white/60 hover:text-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {currentIndex === 0 ? " " : "Back"}
                </button>

                <div className="flex items-center gap-3">
                  <p className="text-[11px] text-white/45 hidden sm:block">
                    Press Enter to continue
                  </p>
                  {currentIndex === totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={stepState === "submitting"}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 px-5 py-2.5 text-xs md:text-sm font-medium text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/45 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {stepState === "submitting"
                        ? "Submitting..."
                        : "Submit assessment"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={stepState === "submitting"}
                      className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2.5 text-xs md:text-sm font-medium hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;


import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "../questionnaire/questions";

const API_BASE =
  typeof import.meta.env?.VITE_API_BASE_URL === "string" && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "https://final-agency-website.vercel.app";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

type StepState = "idle" | "submitting" | "success" | "error";

const QuestionnairePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepState, setStepState] = useState<StepState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  if (stepState === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full space-y-6 glass-dark rounded-3xl border border-purple-500/20 px-6 py-8 md:px-10 md:py-10">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80">
            AI Operational Assessment
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Assessment received. We’ll send your AI action plan shortly.
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            We’ll review your answers to diagnose automation gaps across your
            revenue engine, operations, data, and tech stack. Expect a concise
            breakdown of where automation can unlock the most value.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-2xl w-full space-y-6">
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


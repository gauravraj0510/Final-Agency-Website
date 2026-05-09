import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  ScanSearch,
  Workflow,
  Cpu,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  Zap,
  Shield,
  Building2,
  Rocket,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  lifecycleStages,
  RadarScan,
  CodeEditor,
  IntegrationVisual,
  OptimizationStatus,
  type LifecycleStage,
} from "../components/MetaScroll";
import { useDocumentMeta } from "../lib/useDocumentMeta";

/* ------------------------------------------------------------------ */
/* Per-offering enriched metadata                                     */
/* ------------------------------------------------------------------ */

interface OfferingMeta {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly tagline: string;
  readonly deliverables: readonly string[];
  readonly idealFor: readonly string[];
  readonly outcome: string;
  readonly accentFrom: string;
  readonly accentTo: string;
}

const offeringMeta: Record<number, OfferingMeta> = {
  1: {
    icon: ScanSearch,
    tagline: "Know exactly where AI fits before you build anything.",
    deliverables: [
      "Operational AI readiness audit across teams, tools, and data",
      "Bottleneck heatmap with quantified impact",
      "Prioritised opportunity roadmap (90-day, 6-month, 12-month)",
      "Vendor & technology shortlist tailored to your stack",
    ],
    idealFor: [
      "Mid-market teams ready to invest in AI",
      "Founders evaluating where AI moves the needle",
      "Operations leaders fighting fragmented workflows",
    ],
    outcome: "A clear, executable plan — not another slide deck.",
    accentFrom: "#a855f7",
    accentTo: "#7c3aed",
  },
  2: {
    icon: Workflow,
    tagline: "Replace manual work with intelligent, always-on workflows.",
    deliverables: [
      "Custom AI agents wired into your existing tools",
      "End-to-end workflow orchestration (n8n, Make, custom)",
      "Smart triggers, conditional logic, and error handling",
      "Monitoring, logging, and human-in-the-loop checkpoints",
    ],
    idealFor: [
      "Teams drowning in repetitive ops work",
      "Sales & support orgs with messy handoffs",
      "Companies scaling faster than headcount",
    ],
    outcome: "Hours back per person, every single week.",
    accentFrom: "#c084fc",
    accentTo: "#a855f7",
  },
  3: {
    icon: Cpu,
    tagline: "AI built for your business, not the other way around.",
    deliverables: [
      "RAG systems, copilots, and domain-specific chatbots",
      "Custom model fine-tuning and prompt engineering",
      "Integrations with CRMs, databases, and internal tools",
      "Production-grade APIs with auth, caching, and rate limits",
    ],
    idealFor: [
      "Companies with unique data and workflows",
      "Teams needing assistants that know their domain",
      "Products differentiating through AI features",
    ],
    outcome: "AI that actually understands your context.",
    accentFrom: "#7c3aed",
    accentTo: "#5b21b6",
  },
  4: {
    icon: TrendingUp,
    tagline: "Keep AI working harder for you, every quarter.",
    deliverables: [
      "Continuous performance monitoring & alerting",
      "Quarterly optimisation reviews with roadmap updates",
      "Cost & latency tracking across model providers",
      "New feature scoping as your operations evolve",
    ],
    idealFor: [
      "Existing AI deployments without ongoing oversight",
      "Teams that want to stay ahead of model changes",
      "Companies treating AI as a long-term operating layer",
    ],
    outcome: "Compounding returns — your AI gets better with time.",
    accentFrom: "#a855f7",
    accentTo: "#c084fc",
  },
};

/* ------------------------------------------------------------------ */
/* Background canvas — gradient orbs + grid                           */
/* ------------------------------------------------------------------ */

const PageBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div
      className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.08]"
      style={{
        background:
          "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
        top: "-20%",
        left: "-15%",
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.06]"
      style={{
        background:
          "radial-gradient(circle, #a855f7 0%, transparent 70%)",
        bottom: "5%",
        right: "-15%",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero section                                                        */
/* ------------------------------------------------------------------ */

const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={targetRef}
      className="relative min-h-[90vh] flex items-center justify-center px-4 pt-32 pb-20"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Editorial section marker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-3 mb-10"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="block h-px w-12 bg-gradient-to-r from-purple-500 to-purple-500/0 origin-left"
            aria-hidden
          />
          <span className="font-mono text-[11px] tracking-[0.3em] text-gray-400 uppercase">
            What we build
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-gray-400">
            Four offerings.
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-500">
            One operating layer for AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From the first audit to long-term optimisation, every Avelix
          engagement plugs into a single, coherent AI delivery model. Pick the
          piece you need today — the rest scales when you&rsquo;re ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <a
            href="/questionnaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium hover:from-purple-500 hover:to-violet-500 transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            Take the free assessment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/919136239673?text=Hi%20Avelix%20-%20I%27d%20like%20to%20discuss%20an%20engagement"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-gray-300 text-sm font-medium hover:text-white hover:border-purple-400/40 transition-all"
          >
            Talk to us
          </a>
        </motion.div>

        {/* Floating stat chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {[
            { label: "Projects delivered", value: "130+" },
            { label: "Avg time-to-value", value: "4 wks" },
            { label: "Countries served", value: "7" },
            { label: "Free assessment", value: "₹0" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm py-4 px-3"
            >
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 flex flex-col items-center gap-2"
      >
        Scroll to explore
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[2px] h-6 bg-gradient-to-b from-purple-400 to-transparent"
        />
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Offering — sticky-pinned block, alternating layout                 */
/* ------------------------------------------------------------------ */

interface OfferingBlockProps {
  readonly stage: LifecycleStage;
  readonly index: number;
}

const visualForStage = (id: number): React.ReactNode => {
  switch (id) {
    case 1:
      return <RadarScan />;
    case 2:
      return <CodeEditor />;
    case 3:
      return <IntegrationVisual />;
    case 4:
      return <OptimizationStatus />;
    default:
      return null;
  }
};

const OfferingBlock: React.FC<OfferingBlockProps> = ({ stage, index }) => {
  const meta = offeringMeta[stage.id];
  const Icon = meta.icon;
  const reversed = index % 2 === 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const numberScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            reversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Stage number + editorial label */}
            <div className="flex items-end gap-5">
              <motion.div
                style={{ scale: numberScale }}
                className="text-7xl md:text-8xl font-bold leading-none"
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${meta.accentFrom} 0%, ${meta.accentTo} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {String(stage.id).padStart(2, "0")}
                </span>
              </motion.div>

              {/* Vertical divider + label stack — editorial */}
              <div className="flex items-stretch gap-3 pb-2">
                <span
                  className="block w-px self-stretch"
                  style={{
                    background: `linear-gradient(180deg, ${meta.accentFrom} 0%, transparent 100%)`,
                  }}
                  aria-hidden
                />
                <div className="flex flex-col gap-1.5 leading-none">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                    Phase
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.25em] text-purple-300 uppercase">
                    <Icon className="w-3.5 h-3.5" />
                    {stage.name}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {stage.title}
            </h2>

            <p className="text-lg text-purple-300/90 font-medium">{meta.tagline}</p>

            <p className="text-gray-400 text-base leading-relaxed">
              {stage.description}
            </p>

            {/* Deliverables list */}
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ staggerChildren: 0.08 }}
              className="space-y-3 pt-4"
            >
              {meta.deliverables.map((item) => (
                <motion.li
                  key={item}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Outcome callout */}
            <div
              className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-5"
              style={{
                boxShadow: `0 0 50px -20px ${meta.accentFrom}`,
              }}
            >
              <div className="text-xs uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-2">
                <Target className="w-3 h-3" />
                Outcome
              </div>
              <p className="text-white font-medium">{meta.outcome}</p>
            </div>
          </motion.div>

          {/* Visual column with parallax */}
          <motion.div
            style={{ y: visualY }}
            className="relative"
          >
            {/* Glow halo */}
            <div
              className="absolute -inset-8 rounded-[3rem] opacity-30 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${meta.accentFrom}, transparent 70%)`,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-xl p-6 sm:p-10 overflow-hidden"
            >
              <div className="relative z-10">{visualForStage(stage.id)}</div>
            </motion.div>

            {/* "Ideal for" pills floating below the visual */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-3"
            >
              <div className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                Ideal for
              </div>
              <div className="flex flex-wrap gap-2">
                {meta.idealFor.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Engagement process                                                  */
/* ------------------------------------------------------------------ */

const processSteps = [
  {
    icon: Sparkles,
    title: "Discovery call",
    desc: "30-min walk-through of your operations, goals, and constraints.",
  },
  {
    icon: Target,
    title: "Engagement scoping",
    desc: "We map the right offering(s) and shape a fixed-scope proposal.",
  },
  {
    icon: Zap,
    title: "Sprint kickoff",
    desc: "Engagement letter signed, 50% advance, and we get to work.",
  },
  {
    icon: Rocket,
    title: "Delivery & handover",
    desc: "Working systems, documentation, and a clear path to scale.",
  },
];

const ProcessSection: React.FC = () => (
  <section className="relative py-24 md:py-32 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        {/* Editorial section marker */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="block h-px w-10 bg-gradient-to-r from-purple-500 to-purple-500/0" aria-hidden />
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-gray-400 uppercase">
            <Clock className="w-3 h-3" />
            How it runs
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          Predictable, no surprises.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {processSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative h-full rounded-2xl overflow-hidden p-[1px] group"
            >
              {/* Animated rotating border — matches Elevate Your Vision cards */}
              <span
                className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0a0a0a_0%,#a855f7_50%,#0a0a0a_100%)]"
                aria-hidden
              />
              <div className="relative h-full rounded-2xl bg-black p-6 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

const CTASection: React.FC = () => (
  <section className="relative py-24 md:py-32 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-900/40 via-[#0a0a0a] to-[#050505] p-10 sm:p-14 md:p-20 text-center"
      >
        <div className="relative z-10 space-y-6">
          <Shield className="w-10 h-10 text-purple-300 mx-auto" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Not sure which offering fits?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Take our free 5-minute AI Operational Assessment. We&rsquo;ll
            generate a personalised snapshot showing exactly which offering(s)
            will move the needle for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="/questionnaire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium hover:from-purple-500 hover:to-violet-500 transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              Take the free assessment
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@avelix.io"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/15 text-gray-300 text-sm font-medium hover:text-white hover:border-purple-400/40 transition-all"
            >
              Email us
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const OfferingsPage: React.FC = () => {
  useDocumentMeta({
    title: "Offerings — AI Auditing, Automation & Custom Solutions | Avelix",
    description:
      "Explore Avelix's four AI offerings: AI Auditing, AI Automations, Custom AI Solutions, and Operations Optimization. Plug in where you need help today and scale when you're ready.",
    canonical: "https://avelix.io/offerings",
  });

  // Smooth-scroll anchor handling for in-page hashes (#offering-1, etc.)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      <PageBackground />
      <Navigation />

      <main className="relative z-10">
        <Hero />

        {lifecycleStages.map((stage, idx) => (
          <div key={stage.id} id={`offering-${stage.id}`}>
            <OfferingBlock stage={stage} index={idx} />
          </div>
        ))}

        <ProcessSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default OfferingsPage;

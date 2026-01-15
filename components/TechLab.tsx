import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const verbs = ["Build", "Automate"];
const nouns = ["Dashboard", "Workflow"];

const contentMap: Record<string, { title: string; description: string; features: string[] }> = {
  "Build-Dashboard": {
    title: "Design intelligent dashboards",
    description: "Create dashboards that surface insights the way you would. Real-time data visualization that thinks like you.",
    features: ["Real-time analytics", "Custom widgets", "AI-powered insights"]
  },
  "Build-Workflow": {
    title: "Craft custom workflows",
    description: "Design workflows that mirror your decision-making process. Automate without losing the human touch.",
    features: ["Visual workflow builder", "Conditional logic", "Integration ready"]
  },
  "Automate-Dashboard": {
    title: "Automated reporting & monitoring",
    description: "Your clone monitors metrics, generates reports, and alerts you to what matters most.",
    features: ["Scheduled reports", "Smart alerts", "Trend detection"]
  },
  "Automate-Workflow": {
    title: "Streamlined process automation",
    description: "Streamline repetitive tasks and let your clone manage the entire process flow.",
    features: ["Task automation", "Process optimization", "Error handling"]
  }
};

const getContent = (verb: string, noun: string) => {
  const key = `${verb}-${noun}`;
  return contentMap[key] || {
    title: `${verb} your ${noun}`,
    description: `Powerful tools to ${verb.toLowerCase()} your ${noun.toLowerCase()} efficiently`,
    features: ["AI-powered", "Easy to use", "Fast results"]
  };
};

// Clean flip word - no boxes, just the text with prev/next submerged
const FlipWord = ({
  words,
  currentIndex,
  colorClass
}: {
  words: string[];
  currentIndex: number;
  colorClass: string;
}) => {
  const prevIndex = (currentIndex - 1 + words.length) % words.length;
  const nextIndex = (currentIndex + 1) % words.length;

  return (
    <span className="relative inline-flex flex-col items-center justify-center h-[90px] sm:h-[100px]">
      {/* Previous word - transparent, submerging at top */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`prev-${prevIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.2, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-6 text-xs sm:text-sm text-gray-500 font-medium"
        >
          {words[prevIndex]}
        </motion.span>
      </AnimatePresence>

      {/* Current word - 100% visible, big and bold */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`current-${currentIndex}`}
          initial={{ opacity: 0, y: 25, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -25, scale: 0.85 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${colorClass}`}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>

      {/* Next word - transparent, submerging at bottom */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`next-${nextIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.2, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-6 text-xs sm:text-sm text-gray-500 font-medium"
        >
          {words[nextIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const TechLab = () => {
  const [verbIndex, setVerbIndex] = useState(0);
  const [nounIndex, setNounIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNounIndex((prev) => {
        const next = (prev + 1) % nouns.length;
        if (next === 0) {
          setVerbIndex((prevVerb) => (prevVerb + 1) % verbs.length);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const content = getContent(verbs[verbIndex], nouns[nounIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-16 sm:py-20">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Flip Text Heading - Clean, no boxes */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap mb-16">
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Experience Delphi,
            </span>

            <FlipWord
              words={verbs}
              currentIndex={verbIndex}
              colorClass="text-purple-400"
            />

            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              my
            </span>

            <FlipWord
              words={nouns}
              currentIndex={nounIndex}
              colorClass="text-violet-400"
            />
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${verbs[verbIndex]}-${nouns[nounIndex]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-4">
                {content.title}
              </h3>

              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                {content.description}
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                {content.features.map((feature, i) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300"
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-base sm:text-lg rounded-full hover:from-purple-500 hover:to-violet-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get Started →
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TechLab;

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Page-wide scroll progress bar — fixed gradient strip at the top
 * that fills as the user scrolls. Mounted once at the app root so
 * every route gets it for free.
 */
const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-fuchsia-400 to-violet-600 origin-left z-[55] pointer-events-none"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgressBar;

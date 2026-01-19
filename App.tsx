import React, { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LogoMarquee from './components/LogoMarquee';
import MetaScroll from './components/MetaScroll';
import PinnedScrollSection from './components/PinnedScrollSection';

import Founders from './components/Founders';
import Footer from './components/Footer';
import gsap from 'gsap';

const App: React.FC = () => {
  useEffect(() => {
    // Global GSAP settings
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-900 selection:text-purple-100 overflow-hidden">
      <Navigation />
      <main>
        <Hero />
        <LogoMarquee />
        <MetaScroll />
        <PinnedScrollSection />

        <Founders />
      </main>
      <Footer />
    </div>
  );
};

export default App;
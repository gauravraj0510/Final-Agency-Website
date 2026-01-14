import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TechLab from './components/TechLab';
import Services from './components/Services';
import Founders from './components/Founders';
import gsap from 'gsap';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Global GSAP settings
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-[#050505] text-white selection:bg-orange-900 selection:text-orange-100' : 'bg-white text-slate-900 selection:bg-orange-100 selection:text-orange-900'} overflow-hidden`}>
      <Navigation isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main>
        <Hero isDarkMode={isDarkMode} />
        <TechLab isDarkMode={isDarkMode} />
        <Services isDarkMode={isDarkMode} />
        <Founders isDarkMode={isDarkMode} />
      </main>
    </div>
  );
};

export default App;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LogoMarquee from './components/LogoMarquee';
import MetaScroll from './components/MetaScroll';
import PinnedScrollSection from './components/PinnedScrollSection';
import Founders from './components/Founders';
import Footer from './components/Footer';
import gsap from 'gsap';
import QuestionnairePage from './pages/QuestionnairePage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import GrievanceRedressal from './pages/GrievanceRedressal';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-900 selection:text-purple-100 overflow-hidden">
    <Navigation />
    <main>
      <Hero />
      {/* <LogoMarquee /> */}
      <MetaScroll />
      <PinnedScrollSection />
      <Founders />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Global GSAP settings
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/analysis/:docId" element={<AnalysisDashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/grievance" element={<GrievanceRedressal />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
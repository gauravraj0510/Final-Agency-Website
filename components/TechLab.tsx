import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface TechLabProps {
  isDarkMode: boolean;
}

const TechLab: React.FC<TechLabProps> = ({ isDarkMode }) => {
  const actionWords = ['Automate', 'Build', 'Deploy'];
  const targetWords = ['CRM', 'Dashboard', 'Workflow'];
  
  // 9 unique content descriptions for each action + target combination
  const contentMap: Record<string, string> = {
    'Automate-CRM': 'Let your clone handle customer relationships, follow-ups, and lead nurturing 24/7.',
    'Automate-Dashboard': 'Your clone monitors metrics, generates reports, and alerts you to what matters.',
    'Automate-Workflow': 'Streamline repetitive tasks and let your clone manage the entire process flow.',
    'Build-CRM': 'Create a personalized customer management system that thinks like you do.',
    'Build-Dashboard': 'Design intelligent dashboards that surface insights the way you would.',
    'Build-Workflow': 'Craft custom workflows that mirror your decision-making process.',
    'Deploy-CRM': 'Launch your AI-powered CRM assistant to start engaging customers instantly.',
    'Deploy-Dashboard': 'Go live with real-time analytics that your clone keeps updated for you.',
    'Deploy-Workflow': 'Ship automated workflows that scale your expertise across your organization.',
  };
  
  const [actionIndex, setActionIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  
  const actionRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  
  // Track current position in nested loop
  const targetCountRef = useRef(0);
  
  // Get current content based on combination
  const currentContent = contentMap[`${actionWords[actionIndex]}-${targetWords[targetIndex]}`];

  useEffect(() => {
    const animateTarget = () => {
      // Animate content out first
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.in',
      });
      
      gsap.to(targetRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Increment target counter
          targetCountRef.current += 1;
          const nextTargetIndex = targetCountRef.current % targetWords.length;
          
          // If we've completed a full cycle of targets (back to 0), change action
          if (nextTargetIndex === 0) {
            // Animate action word change
            gsap.to(actionRef.current, {
              y: -20,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => {
                setActionIndex((prev) => (prev + 1) % actionWords.length);
                gsap.fromTo(actionRef.current,
                  { y: 20, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
              }
            });
          }
          
          setTargetIndex(nextTargetIndex);
          gsap.fromTo(targetRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
          );
          
          // Animate content in after target changes
          gsap.fromTo(contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
          );
        }
      });
    };

    // Animate target every 2 seconds (slightly longer to read content)
    const targetInterval = setInterval(animateTarget, 2000);

    return () => {
      clearInterval(targetInterval);
    };
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center transition-colors duration-700 ${isDarkMode ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className="text-center px-6 max-w-4xl">
        <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <span>Hey John, </span>
          <span 
            ref={actionRef}
            className={`inline-block px-4 py-1 mx-1 rounded-lg ${isDarkMode ? 'bg-white/10 text-orange-400' : 'bg-slate-100 text-orange-600'}`}
          >
            {actionWords[actionIndex]}
          </span>
          <span> my </span>
          <span 
            ref={targetRef}
            className={`inline-block px-4 py-1 mx-1 rounded-lg ${isDarkMode ? 'bg-white/10 text-orange-400' : 'bg-slate-100 text-orange-600'}`}
          >
            {targetWords[targetIndex]}
          </span>
        </h2>
        
        <p 
          ref={contentRef}
          className={`mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}
        >
          {currentContent}
        </p>
      </div>
    </section>
  );
};

export default TechLab;

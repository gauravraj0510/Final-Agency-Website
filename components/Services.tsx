import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface ServicesProps {
  isDarkMode: boolean;
}

interface ServiceCard {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  textDark?: boolean;
}

const Services: React.FC<ServicesProps> = ({ isDarkMode }) => {
  const [activeCard, setActiveCard] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(SVGPathElement | null)[]>([]);
  const pulseRef = useRef<(SVGCircleElement | null)[]>([]);

  const services: ServiceCard[] = [
    {
      id: 0,
      title: 'Web Development',
      subtitle: 'Full-Stack Apps',
      color: 'bg-violet-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: 1,
      title: 'Mobile Apps',
      subtitle: 'iOS & Android',
      color: 'bg-emerald-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Cloud Solutions',
      subtitle: 'AWS & Azure',
      color: 'bg-sky-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'UI/UX Design',
      subtitle: 'User Experience',
      color: 'bg-pink-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'DevOps',
      subtitle: 'CI/CD Pipelines',
      color: 'bg-orange-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'AI & ML',
      subtitle: 'Smart Solutions',
      color: 'bg-cyan-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Cybersecurity',
      subtitle: 'Protection & Audit',
      color: 'bg-slate-700',
      textDark: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 7,
      title: 'API Integration',
      subtitle: 'Connect Systems',
      color: 'bg-amber-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  // SVG dimensions for desktop
  const svgWidth = 900;
  const svgHeight = 600;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Card positions (4 on left, 4 on right) - Desktop only
  const cardPositions = [
    { x: 60, y: 60 },
    { x: 40, y: 170 },
    { x: 40, y: 360 },
    { x: 60, y: 470 },
    { x: 680, y: 60 },
    { x: 700, y: 170 },
    { x: 700, y: 360 },
    { x: 680, y: 470 },
  ];

  // Diamond positions on lines
  const diamondPositions = [
    { x: 280, y: 120 },
    { x: 260, y: 200 },
    { x: 260, y: 380 },
    { x: 280, y: 460 },
    { x: 620, y: 120 },
    { x: 640, y: 200 },
    { x: 640, y: 380 },
    { x: 620, y: 460 },
  ];

  // Curved paths from center to cards
  const getPaths = () => [
    `M ${centerX} ${centerY} Q ${centerX - 100} ${centerY - 100} ${diamondPositions[0].x} ${diamondPositions[0].y} Q ${cardPositions[0].x + 100} ${cardPositions[0].y + 30} ${cardPositions[0].x + 170} ${cardPositions[0].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX - 120} ${centerY - 40} ${diamondPositions[1].x} ${diamondPositions[1].y} Q ${cardPositions[1].x + 100} ${cardPositions[1].y + 20} ${cardPositions[1].x + 170} ${cardPositions[1].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX - 120} ${centerY + 40} ${diamondPositions[2].x} ${diamondPositions[2].y} Q ${cardPositions[2].x + 100} ${cardPositions[2].y + 10} ${cardPositions[2].x + 170} ${cardPositions[2].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX - 100} ${centerY + 100} ${diamondPositions[3].x} ${diamondPositions[3].y} Q ${cardPositions[3].x + 100} ${cardPositions[3].y} ${cardPositions[3].x + 170} ${cardPositions[3].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX + 100} ${centerY - 100} ${diamondPositions[4].x} ${diamondPositions[4].y} Q ${cardPositions[4].x - 20} ${cardPositions[4].y + 30} ${cardPositions[4].x} ${cardPositions[4].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX + 120} ${centerY - 40} ${diamondPositions[5].x} ${diamondPositions[5].y} Q ${cardPositions[5].x - 20} ${cardPositions[5].y + 20} ${cardPositions[5].x} ${cardPositions[5].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX + 120} ${centerY + 40} ${diamondPositions[6].x} ${diamondPositions[6].y} Q ${cardPositions[6].x - 20} ${cardPositions[6].y + 10} ${cardPositions[6].x} ${cardPositions[6].y + 25}`,
    `M ${centerX} ${centerY} Q ${centerX + 100} ${centerY + 100} ${diamondPositions[7].x} ${diamondPositions[7].y} Q ${cardPositions[7].x - 20} ${cardPositions[7].y} ${cardPositions[7].x} ${cardPositions[7].y + 25}`,
  ];

  useEffect(() => {
    linesRef.current.forEach((line) => {
      if (line) {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }
    });
  }, []);

  useEffect(() => {
    const animateSequence = () => {
      const currentIndex = activeCard;
      const line = linesRef.current[currentIndex];
      const card = cardsRef.current[currentIndex];
      const pulse = pulseRef.current[currentIndex];

      if (!line || !card) return;

      const length = line.getTotalLength();

      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          setActiveCard((prev) => (prev + 1) % services.length);
        },
      });

      tl.to(line, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out',
      });

      if (pulse) {
        tl.to(pulse, {
          scale: 1.5,
          opacity: 0.8,
          duration: 0.25,
          ease: 'power2.out',
        }, '-=0.3');
        tl.to(pulse, {
          scale: 1,
          opacity: 0,
          duration: 0.25,
        }, '+=0.1');
      }

      tl.to(card, {
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
        scale: 1.05,
        duration: 0.25,
        ease: 'power2.out',
      }, '-=0.4');

      tl.to({}, { duration: 1 });

      tl.to(card, {
        boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
        scale: 1,
        duration: 0.25,
        ease: 'power2.in',
      });

      tl.to(line, {
        strokeDashoffset: -length,
        duration: 0.4,
        ease: 'power2.in',
      }, '-=0.25');
    };

    const timeout = setTimeout(animateSequence, 300);
    return () => clearTimeout(timeout);
  }, [activeCard]);

  // Mobile card component
  const MobileCard = ({ service, index }: { service: ServiceCard; index: number }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${service.color} ${
        activeCard === index ? 'ring-2 ring-offset-2 ring-violet-400 scale-105' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        service.textDark ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
      }`}>
        {service.icon}
      </div>
      <div className="min-w-0">
        <h3 className={`font-semibold text-sm ${service.textDark ? 'text-white' : 'text-black'}`}>
          {service.title}
        </h3>
        <p className={`text-xs ${service.textDark ? 'text-gray-300' : 'text-black/60'}`}>
          {service.subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center py-16 md:py-20 transition-colors duration-700 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Our Services
        </h2>
        <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          End-to-end technical solutions to transform your business.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>From concept to deployment, we've got you covered.
        </p>
        <button className={`mt-6 px-6 py-2.5 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
          isDarkMode 
            ? 'border-white/20 text-white hover:bg-white/10' 
            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
        }`}>
          View All Services
        </button>
      </div>

      {/* Mobile Layout - Grid */}
      <div className="lg:hidden w-full max-w-2xl px-4">
        {/* Central Chip for Mobile */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
              isDarkMode ? 'bg-gradient-to-br from-violet-600 to-purple-700' : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
        </div>
        
        {/* Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <MobileCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop Layout - With SVG Animation */}
      <div className="hidden lg:block relative" style={{ width: svgWidth, height: svgHeight }}>
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ overflow: 'visible' }}
        >
          {/* Base lines */}
          {getPaths().map((path, index) => (
            <path
              key={`base-${index}`}
              d={path}
              fill="none"
              stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
              strokeWidth="2"
            />
          ))}

          {/* Animated pulse lines */}
          {getPaths().map((path, index) => (
            <path
              key={`pulse-${index}`}
              ref={(el) => (linesRef.current[index] = el)}
              d={path}
              fill="none"
              stroke={isDarkMode ? '#a78bfa' : '#8b5cf6'}
              strokeWidth="2.5"
            />
          ))}

          {/* Diamond nodes */}
          {diamondPositions.map((pos, index) => (
            <g key={`diamond-${index}`} transform={`translate(${pos.x}, ${pos.y})`}>
              <rect
                x="-7"
                y="-7"
                width="14"
                height="14"
                fill={isDarkMode ? '#1a1a1a' : 'white'}
                stroke={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}
                strokeWidth="1.5"
                transform="rotate(45)"
                rx="2"
              />
              <line x1="-3" y1="0" x2="3" y2="0" stroke={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5" />
              <circle
                ref={(el) => (pulseRef.current[index] = el)}
                cx="0"
                cy="0"
                r="10"
                fill={isDarkMode ? '#a78bfa' : '#8b5cf6'}
                opacity="0"
              />
            </g>
          ))}
        </svg>

        {/* Central Chip - Desktop */}
        <div
          className={`absolute z-20 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-colors duration-500 ${
            isDarkMode ? 'bg-gradient-to-br from-violet-600 to-purple-700' : 'bg-gradient-to-br from-violet-500 to-purple-600'
          }`}
          style={{ 
            left: centerX, 
            top: centerY, 
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 rounded-2xl animate-ping bg-violet-500 opacity-20" />
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>

        {/* Service Cards - Desktop */}
        {services.map((service, index) => (
          <div
            key={service.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`absolute flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${service.color} ${
              activeCard === index ? 'ring-2 ring-offset-2 ring-violet-400' : ''
            }`}
            style={{
              left: cardPositions[index].x,
              top: cardPositions[index].y,
              minWidth: '155px',
            }}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              service.textDark ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
            }`}>
              {service.icon}
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${service.textDark ? 'text-white' : 'text-black'}`}>
                {service.title}
              </h3>
              <p className={`text-xs ${service.textDark ? 'text-gray-300' : 'text-black/60'}`}>
                {service.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

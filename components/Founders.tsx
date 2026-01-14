import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface FoundersProps {
  isDarkMode: boolean;
}

const Founders: React.FC<FoundersProps> = ({ isDarkMode }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const founders = [
    {
      id: 1,
      name: 'Alex Chen',
      title: 'Co-Founder & CEO',
      bio: 'Former Google engineer with 10+ years building scalable systems. Passionate about democratizing AI technology.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&fit=crop',
      gradient: 'from-violet-600 to-indigo-600',
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
      },
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      title: 'Co-Founder & CTO',
      bio: 'Ex-Meta tech lead specializing in distributed systems. Building the infrastructure for tomorrow\'s applications.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&fit=crop',
      gradient: 'from-rose-500 to-orange-500',
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
      },
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle floating animation for cards
      gsap.to(card1Ref.current, {
        y: -10,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(card2Ref.current, {
        y: -10,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-700 ${
        isDarkMode ? 'bg-[#030303]' : 'bg-slate-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode ? 'bg-violet-600/10' : 'bg-violet-300/30'
        }`} />
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode ? 'bg-rose-600/10' : 'bg-rose-300/30'
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isDarkMode ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-white text-slate-600 shadow-sm border border-slate-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            The Visionaries
          </div>
          <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Meet Our{' '}
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            Two industry veterans on a mission to revolutionize how businesses leverage technology.
          </p>
        </div>

        {/* Founders Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {founders.map((founder, index) => (
            <div
              key={founder.id}
              ref={index === 0 ? card1Ref : card2Ref}
              className={`group relative rounded-3xl overflow-hidden ${
                isDarkMode ? 'bg-white/[0.02]' : 'bg-white'
              } border ${
                isDarkMode ? 'border-white/5' : 'border-slate-200'
              } hover:border-transparent transition-all duration-500`}
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${founder.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              <div className={`absolute inset-[1px] rounded-3xl ${isDarkMode ? 'bg-[#080808]' : 'bg-white'} z-0`} />
              
              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-br ${founder.gradient} p-[3px]`}>
                      <div className="w-full h-full rounded-2xl overflow-hidden">
                        <img
                          src={founder.image}
                          alt={founder.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    {/* Floating badge */}
                    <div className={`absolute -bottom-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold ${
                      isDarkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white'
                    } shadow-lg`}>
                      Available
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`text-2xl sm:text-3xl font-bold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {founder.name}
                    </h3>
                    <p className={`text-base font-medium mb-4 bg-gradient-to-r ${founder.gradient} bg-clip-text text-transparent`}>
                      {founder.title}
                    </p>
                    <p className={`text-sm sm:text-base leading-relaxed mb-6 ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {founder.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      {founder.socials.linkedin && (
                        <a
                          href={founder.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <svg className="w-5 h-5 transition-transform group-hover/icon:scale-110" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {founder.socials.twitter && (
                        <a
                          href={founder.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <svg className="w-5 h-5 transition-transform group-hover/icon:scale-110" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {founder.socials.github && (
                        <a
                          href={founder.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <svg className="w-5 h-5 transition-transform group-hover/icon:scale-110" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      
                      {/* Connect Button */}
                      <button className={`ml-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r ${founder.gradient} text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105`}>
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
            Want to join our team?
          </p>
          <a
            href="#careers"
            className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3 ${
              isDarkMode ? 'text-white hover:text-violet-400' : 'text-slate-900 hover:text-violet-600'
            }`}
          >
            View Open Positions
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Founders;

import React, { useRef, useEffect } from 'react';
import { Linkedin, Twitter, Github, Sparkles, Zap, Code2, Brain } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Founders: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const founders = [
    {
      id: 1,
      name: 'Alex Chen',
      title: 'Co-Founder & CEO',
      tagline: 'Building the future of automation',
      bio: 'Former Google engineer with 10+ years building scalable systems. Led teams that shipped products to 100M+ users. Now democratizing AI for businesses of all sizes.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&fit=crop',
      achievements: ['Ex-Google', '100M+ Users', '15+ Patents'],
      icon: Brain,
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
      tagline: 'Architecting tomorrow\'s infrastructure',
      bio: 'Ex-Meta tech lead specializing in distributed systems and ML infrastructure. Built systems processing 1B+ events daily. Passionate about elegant, scalable solutions.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&fit=crop',
      achievements: ['Ex-Meta', '1B+ Events/Day', 'Stanford CS'],
      icon: Code2,
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
      },
    },
  ];

  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '$2M+', label: 'Revenue Generated' },
    { value: '24/7', label: 'Support' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );

      // Card 1 - slide in from left
      gsap.fromTo(
        card1Ref.current,
        { opacity: 0, x: -100, rotateY: 15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card1Ref.current,
            start: 'top 80%',
          },
        }
      );

      // Card 2 - slide in from right
      gsap.fromTo(
        card2Ref.current,
        { opacity: 0, x: 100, rotateY: -15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: card2Ref.current,
            start: 'top 80%',
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            top: '10%',
            left: '-10%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            bottom: '20%',
            right: '-5%',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div ref={titleRef} className="text-center mb-20">
          

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Meet the </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #c084fc 100%)',
              }}
            >
              Visionaries
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Two industry pioneers who left Big Tech to build something extraordinary.
            <br className="hidden sm:block" />
            Combined 20+ years of experience from Google, Meta, and Stanford.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {founders.map((founder, index) => {
            const cardRef = index === 0 ? card1Ref : card2Ref;
            const Icon = founder.icon;

            return (
              <div
                key={founder.id}
                ref={cardRef}
                className="group relative"
                style={{ perspective: '1000px' }}
              >
                {/* Card Container */}
                <div
                  className="relative rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(168, 85, 247, 0.05) 100%)',
                    border: '1px solid rgba(168, 85, 247, 0.15)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
                    }}
                  />

                  {/* Top Section - Image & Quick Info */}
                  <div className="relative">
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(168, 85, 247, 0.3) 1px, transparent 0)`,
                        backgroundSize: '20px 20px',
                      }}
                    />

                    <div className="relative p-8 pb-0">
                      <div className="flex items-start gap-6">
                        {/* Image Container */}
                        <div className="relative flex-shrink-0">
                          {/* Animated ring */}
                          <div
                            className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc, #7c3aed)',
                              backgroundSize: '300% 300%',
                              animation: 'gradientShift 3s ease infinite',
                            }}
                          />
                          <div
                            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-400/50 transition-colors duration-300"
                            style={{
                              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2)',
                            }}
                          >
                            <img
                              src={founder.image}
                              alt={founder.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                          </div>

                          {/* Icon Badge */}
                          <div
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                            }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 pt-2">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
                            {founder.name}
                          </h3>
                          <p
                            className="text-sm font-semibold mb-3 bg-clip-text text-transparent"
                            style={{
                              backgroundImage: 'linear-gradient(90deg, #a855f7, #c084fc)',
                            }}
                          >
                            {founder.title}
                          </p>
                          <p className="text-gray-400 text-sm italic">
                            "{founder.tagline}"
                          </p>
                        </div>
                      </div>

                      {/* Achievement Tags */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {founder.achievements.map((achievement, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-purple-300 transition-colors duration-300 hover:bg-purple-500/20"
                            style={{
                              background: 'rgba(168, 85, 247, 0.1)',
                              border: '1px solid rgba(168, 85, 247, 0.2)',
                            }}
                          >
                            <Zap className="w-3 h-3 inline mr-1 text-purple-400" />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-8 my-6">
                    <div
                      className="h-px"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
                      }}
                    />
                  </div>

                  {/* Bottom Section - Bio & Socials */}
                  <div className="px-8 pb-8">
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {founder.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium mr-2">Connect:</span>
                      {founder.socials.linkedin && (
                        <a
                          href={founder.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/30"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {founder.socials.twitter && (
                        <a
                          href={founder.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/30"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {founder.socials.github && (
                        <a
                          href={founder.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/30"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner Accents */}
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                      <path
                        d="M100 0 L100 100 L0 100"
                        fill="none"
                        stroke="url(#cornerGradient)"
                        strokeWidth="1"
                      />
                      <defs>
                        <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(168, 85, 247, 0.03) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.1)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                }}
              />

              <div
                className="relative text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
                }}
              >
                {stat.value}
              </div>
              <div className="relative text-gray-500 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(124, 58, 237, 0.08) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.15)',
            }}
          >
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold mb-1">Ready to transform your business?</p>
              <p className="text-gray-400 text-sm">Let's discuss how we can help you scale.</p>
            </div>
            <button
              className="px-6 py-3 rounded-xl font-medium text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              }}
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Founders;

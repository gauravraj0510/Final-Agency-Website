import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PinnedScrollSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerCardRef = useRef<HTMLDivElement>(null);
    const leftColumnRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            // Only enable on desktop
            const isDesktop = window.matchMedia('(min-width: 768px)').matches;
            if (!isDesktop) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=150%', // Pin for 1.5 screen heights
                    pin: true,
                    scrub: 1, // Smooth scrubbing
                    // markers: true, // debug
                },
            });

            // Center Card Animation: Scale 0.9 -> 1, Opacity 0.8 -> 1
            tl.fromTo(
                centerCardRef.current,
                { scale: 0.9, opacity: 0.8 },
                { scale: 1, opacity: 1, ease: 'none' },
                0
            );

            // Left Column Animation: Move Up and Fade Out
            if (leftColumnRef.current) {
                const leftCards = leftColumnRef.current.children;
                tl.to(
                    leftCards,
                    {
                        yPercent: -100,
                        opacity: 0,
                        stagger: 0.1,
                        ease: 'none',
                    },
                    0
                );
            }

            // Right Column Animation: Move Down and Fade Out
            if (rightColumnRef.current) {
                const rightCards = rightColumnRef.current.children;
                tl.to(
                    rightCards,
                    {
                        yPercent: 100,
                        opacity: 0,
                        stagger: 0.1,
                        ease: 'none',
                    },
                    0
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const Card = ({ title, desc }: { title: string; desc: string }) => (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 w-full mb-4 last:mb-0 h-[200px] flex flex-col justify-center">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-20 bg-black overflow-hidden"
        >
            {/* Left Column */}
            <div
                ref={leftColumnRef}
                className="w-full md:w-1/4 flex flex-col gap-6 z-10"
            >
                <Card title="Strategy" desc="Data-driven insights to guide your digital transformation journey." />
                <Card title="Design" desc="Creating intuitive and beautiful user experiences that convert." />
                <Card title="Development" desc="Robust and scalable solution utilizing cutting-edge tech." />
            </div>

            {/* Center Column (Hero) */}
            <div
                ref={centerCardRef}
                className="w-full md:w-2/5 h-[50vh] md:h-[70vh] bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-8 flex flex-col justify-end relative backdrop-blur-xl z-20 shadow-2xl shadow-purple-900/20"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay rounded-3xl" />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Elevate <br /> Your Vision
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-lg">
                        We turn complex challenges into elegant, high-impact digital solutions.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div
                ref={rightColumnRef}
                className="w-full md:w-1/4 flex flex-col gap-6 z-10"
            >
                <Card title="Marketing" desc="Targeted campaigns that reach your audience effectively." />
                <Card title="Analytics" desc="Real-time data monitoring to optimize performance." />
                <Card title="Support" desc="24/7 dedicated support to ensure your success." />
            </div>
        </section>
    );
};

export default PinnedScrollSection;

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PinnedScrollSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerCardRef = useRef<HTMLDivElement>(null);
    const leftColumnRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            const isDesktop = window.matchMedia('(min-width: 768px)').matches;

            if (isDesktop) {
                // Desktop: pinned scroll with side cards animating away
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=150%',
                        pin: true,
                        scrub: 1,
                    },
                });

                tl.fromTo(
                    centerCardRef.current,
                    { scale: 0.9, opacity: 0.8 },
                    { scale: 1, opacity: 1, ease: 'none' },
                    0
                );

                if (leftColumnRef.current) {
                    tl.to(
                        leftColumnRef.current.children,
                        { yPercent: -100, opacity: 0, stagger: 0.1, ease: 'none' },
                        0
                    );
                }

                if (rightColumnRef.current) {
                    tl.to(
                        rightColumnRef.current.children,
                        { yPercent: 100, opacity: 0, stagger: 0.1, ease: 'none' },
                        0
                    );
                }
            }
            // Mobile: no GSAP animation - cards render naturally in their final
            // visible state. Earlier scroll-triggered fade-ins were unreliable
            // (cards remained invisible until scrolled fully past) so we now
            // rely on plain rendering on mobile.
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const Card = ({ title, desc }: { title: string; desc: string }) => (
        <div className="relative h-[200px] w-full overflow-hidden rounded-2xl p-[1px] mb-4 last:mb-0">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1a1a1a_0%,#a855f7_50%,#1a1a1a_100%)]" />
            <div className="relative h-full w-full rounded-2xl bg-black p-6 flex flex-col justify-center backdrop-blur-3xl">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
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
                <Card title="AI Strategy" desc="A clear roadmap for where AI fits, what to build first, and how to measure ROI." />
                <Card title="Data Engineering" desc="Clean, connected data pipelines that make your customer data usable for AI." />
                <Card title="AI Automations" desc="Agents and workflows that remove manual work across ops, sales, and support." />
            </div>

            {/* Center Column (Hero) */}
            <div
                ref={centerCardRef}
                className="w-full md:w-2/5 h-[50vh] md:h-[70vh] bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-8 flex flex-col justify-end relative backdrop-blur-xl z-20 shadow-[0_0_50px_-12px_rgba(168,85,247,0.5)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay rounded-3xl" />
                {/* Animated visual accent (top area) */}
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none">
                    <div className="absolute left-8 top-8 w-[160px] h-[160px] rounded-full bg-gradient-to-br from-purple-600/35 via-fuchsia-500/15 to-transparent blur-2xl animate-avelix-float" />
                    <div className="absolute right-10 top-10 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-transparent blur-3xl animate-avelix-float-delayed" />

                    {/* Square tile */}
                    <div className="absolute left-8 top-8 w-[92px] h-[92px] rounded-2xl bg-black/40 border border-purple-500/25 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_-12px_rgba(168,85,247,0.55)]">
                        <span
                            className="absolute inset-[-120%] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(26,26,26,0)_0%,rgba(168,85,247,0.55)_40%,rgba(26,26,26,0)_80%)] animate-[spin_3.5s_linear_infinite] blur-[1.25px] opacity-90"
                            style={{
                                maskImage:
                                    'radial-gradient(circle, transparent 0 56%, rgba(0,0,0,0.95) 64%, rgba(0,0,0,0.95) 76%, transparent 92%)',
                                WebkitMaskImage:
                                    'radial-gradient(circle, transparent 0 56%, rgba(0,0,0,0.95) 64%, rgba(0,0,0,0.95) 76%, transparent 92%)',
                            }}
                        />
                        <div className="relative w-[78px] h-[78px] rounded-2xl bg-black/70 border border-white/5 flex items-center justify-center">
                            <Sparkles className="w-9 h-9 text-purple-300 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Elevate <br /> Your Vision
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-lg">
                        We turn customer data into AI automations and custom solutions that drive measurable growth.
                    </p>
                </div>
                <style>{`
                    @keyframes avelixFloat {
                        0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.9; }
                        50% { transform: translate3d(0, 10px, 0); opacity: 1; }
                    }
                    .animate-avelix-float { animation: avelixFloat 6s ease-in-out infinite; }
                    .animate-avelix-float-delayed { animation: avelixFloat 7.5s ease-in-out infinite; animation-delay: 0.6s; }

                `}</style>
            </div>

            {/* Right Column */}
            <div
                ref={rightColumnRef}
                className="w-full md:w-1/4 flex flex-col gap-6 z-10"
            >
                <Card title="Custom AI Solutions" desc="RAG, chatbots, copilots, and internal tools tailored to your stack and use cases." />
                <Card title="MLOps & Monitoring" desc="Deploy safely, track performance, and continuously improve models in production." />
                <Card title="AI Governance & Security" desc="Policies, guardrails, and compliance so AI is reliable, safe, and on-brand." />
            </div>

            {/* Bottom fade - merges this section's black bg into the next section (#050505) */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-0 bg-gradient-to-b from-transparent to-[#050505]"
                aria-hidden="true"
            />
        </section>
    );
};

export default PinnedScrollSection;

import { useEffect, useRef } from 'react';

// Reusable Footer Flower Component
const FooterFlower = () => {
    const flowerRef = useRef<SVGSVGElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!flowerRef.current) return;

        let currentRotation = 0;
        let targetRotation = 0;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollY / docHeight, 1);
            targetRotation = scrollProgress * 720;
        };

        const animate = () => {
            const diff = targetRotation - currentRotation;
            currentRotation += diff * 0.08;

            if (flowerRef.current) {
                flowerRef.current.style.transform = `rotate(${currentRotation}deg)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        handleScroll();
        rafRef.current = requestAnimationFrame(animate);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const petalCount = 5;
    const petals = [];

    for (let i = 0; i < petalCount; i++) {
        const angle = (i * 360) / petalCount;
        const isBlack = i % 2 === 0;
        const gradient = isBlack ? 'url(#footerBlackPetal)' : 'url(#footerPurplePetal)';

        petals.push(
            <g key={i} transform={`rotate(${angle} 200 200)`}>
                <path
                    d="M200 50 Q230 120 220 180 Q210 200 200 200 Q190 200 180 180 Q170 120 200 50Z"
                    fill={gradient}
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
                />
                <path
                    d="M200 60 Q205 120 202 175 Q200 185 200 200"
                    stroke={isBlack ? 'rgba(80,80,80,0.4)' : 'rgba(168,85,247,0.4)'}
                    strokeWidth="1.5"
                    fill="none"
                />
            </g>
        );
    }

    return (
        <svg
            ref={flowerRef}
            viewBox="0 0 400 400"
            className="w-48 h-48 md:w-64 md:h-64"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(147, 51, 234, 0.3))' }}
        >
            <defs>
                <linearGradient id="footerBlackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="30%" stopColor="#0d0d0d" />
                    <stop offset="60%" stopColor="#1f1f1f" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
                <linearGradient id="footerPurplePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="25%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="75%" stopColor="#6b21a8" />
                    <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
                <radialGradient id="footerCenterGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2d2d2d" />
                    <stop offset="50%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#0d0d0d" />
                </radialGradient>
            </defs>
            <g>{petals}</g>
            <circle cx="200" cy="200" r="30" fill="url(#footerCenterGradient)" />
        </svg>
    );
};

const Footer = () => {
    return (
        <footer className="relative bg-[#050505] py-20 border-t border-gray-800/50">
            {/* Background Flower - Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none">
                <FooterFlower />
            </div>

            {/* Background Flower - Left */}
            <div className="absolute -left-[340px] top-[-300px] bottom-0 translate-y-1/4 z-50 pointer-events-none rotate-45 transform scale-150">
                <FooterFlower />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        {/* <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                                <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" />
                            </svg>
                        </div> */}
                        <br></br>
                        <br></br>
                        <br></br>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            Empowering entrepreneurs worldwide with streamlined operations and maximized revenue solutions.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {['About', 'Careers', 'Press', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {['Documentation', 'Blog', 'Support', 'API'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-gray-500">
                        © 2026 Delphi. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy', 'Terms', 'Cookies'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { FooterFlower };
export default Footer;

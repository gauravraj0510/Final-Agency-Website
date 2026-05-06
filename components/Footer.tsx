import { useEffect, useRef } from 'react';

const FooterFlower = ({ className }: { className?: string }) => {
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
            targetRotation = scrollProgress * 3000;
        };

        const animate = () => {
            const diff = targetRotation - currentRotation;
            currentRotation += diff * 0.12;
            if (flowerRef.current) flowerRef.current.style.transform = `rotate(${currentRotation}deg)`;
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

    return (
        <svg
            ref={flowerRef}
            viewBox="0 0 400 400"
            className={className ?? "w-56 h-56"}
            style={{ filter: 'drop-shadow(0 20px 40px rgba(147, 51, 234, 0.28))' }}
            aria-hidden
        >
            <defs>
                <linearGradient id="footerBlackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="35%" stopColor="#0d0d0d" />
                    <stop offset="70%" stopColor="#1f1f1f" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
                <linearGradient id="footerPurplePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="30%" stopColor="#9333ea" />
                    <stop offset="55%" stopColor="#7c3aed" />
                    <stop offset="80%" stopColor="#6b21a8" />
                    <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
                <radialGradient id="footerCenterGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2d2d2d" />
                    <stop offset="55%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#0d0d0d" />
                </radialGradient>
            </defs>

            {Array.from({ length: petalCount }).map((_, i) => {
                const angle = (i * 360) / petalCount;
                const isBlack = i % 2 === 0;
                const gradient = isBlack ? 'url(#footerBlackPetal)' : 'url(#footerPurplePetal)';

                return (
                    <g key={i} transform={`rotate(${angle} 200 200)`}>
                        <path
                            d="M200 50 Q230 120 220 180 Q210 200 200 200 Q190 200 180 180 Q170 120 200 50Z"
                            fill={gradient}
                            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
                        />
                        <path
                            d="M200 60 Q205 120 202 175 Q200 185 200 200"
                            stroke={isBlack ? 'rgba(80,80,80,0.35)' : 'rgba(168,85,247,0.35)'}
                            strokeWidth="1.5"
                            fill="none"
                        />
                    </g>
                );
            })}

            <circle cx="200" cy="200" r="30" fill="url(#footerCenterGradient)" />
        </svg>
    );
};

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] border-t border-white/10">
            {/* Subtle background accents */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[90px]" />
                <div className="absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[110px]" />
            </div>

            {/* Flower graphics (overflow-visible + on top) */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
                <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-100">
                    <FooterFlower className="w-56 h-56 md:w-72 md:h-72" />
                </div>
                <div className="absolute -left-40 -top-48 rotate-45 opacity-100">
                    <FooterFlower className="w-64 h-64 md:w-80 md:h-80" />
                </div>
            </div>

            <div className="relative container mx-auto px-6 py-8">
                

                {/* Link grid */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center text-white">
                            <img src="/logo-full-dark.png" alt="Avelix" className="h-12 object-contain" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            AI agency helping teams turn customer data into automations and custom solutions that drive measurable growth.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/919136239673?text=Hey%20I%20want%20to%20automate%20my%20workflow"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                WhatsApp
                            </a>
                            <span className="text-gray-700">•</span>
                            <a
                                href="/questionnaire"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Assessment
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Navigate</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Offerings', href: '#offerings' },
                                { label: 'Credibility', href: '#credibility' },
                                { label: 'Case Studies', href: '#case-studies' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Offerings */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Offerings</h4>
                        <ul className="space-y-3">
                            {[
                                'AI Auditing',
                                'AI Automations',
                                'Custom AI Solutions',
                                'Operations Optimization',
                            ].map((label) => (
                                <li key={label}>
                                    <a href="#lifecycle-desktop" className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Get in touch</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://wa.me/919136239673?text=Hey%20I%20want%20to%20automate%20my%20workflow"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Message us on WhatsApp
                                </a>
                            </li>
                            <li>
                                <a href="/questionnaire" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Take the assessment
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hello@avelix.io" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    hello@avelix.io
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Companies Act §12(3)(c) + Rule 26 — Mandatory Company Info */}
                <div className="mt-14 pt-8 border-t border-white/10 space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase">Avelix Private Limited</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Asteria - A Wing, Flat No. 906, Tower No. 1, Courtyard, Thane West, Thane, Maharashtra 400610, India
                        </p>
                        <p className="text-xs text-gray-500">
                            CIN: U62011MR2026PTC474269 &nbsp;&middot;&nbsp; GSTIN: 27ABFCA1098M1ZA &nbsp;&middot;&nbsp; PAN: ABFCA1098M
                        </p>
                        <p className="text-xs text-gray-500">
                            Phone: <a href="tel:+919136239673" className="hover:text-white transition-colors">+91 91362 39673</a> &nbsp;&middot;&nbsp;
                            Email: <a href="mailto:hello@avelix.io" className="hover:text-white transition-colors">hello@avelix.io</a> &nbsp;&middot;&nbsp;
                            Web: <a href="https://avelix.io" className="hover:text-white transition-colors">avelix.io</a>
                        </p>
                    </div>

                    {/* Legal links */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                        {[
                            { label: 'Privacy Policy', href: '/privacy' },
                            { label: 'Terms of Use', href: '/terms' },
                            { label: 'Cookie Policy', href: '/cookies' },
                            { label: 'Grievance Redressal', href: '/grievance' },
                            { label: 'Disclaimer', href: '/disclaimer' },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <p className="text-xs text-gray-600 pt-2">&copy; {year} Avelix Private Limited. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

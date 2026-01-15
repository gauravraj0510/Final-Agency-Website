import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Box, Gauge, FileText, RefreshCcw, FileCode, Search, Settings, MessageSquare, Workflow, TrendingUp, CheckCircle2 } from 'lucide-react';

// New 4-step lifecycle stages
interface LifecycleStage {
    id: number;
    name: string;
    title: string;
    description: string;
    position: { x: number; y: number };
}

const lifecycleStages: LifecycleStage[] = [
    {
        id: 1,
        name: "DISCOVERY",
        title: "Smart Analyzing",
        description: "Identify AI solutions to streamline workflows and improve efficiency.",
        position: { x: 20, y: 15 },
    },
    {
        id: 2,
        name: "DEVELOPMENT",
        title: "AI Development",
        description: "Build intelligent automation systems tailored to your business.",
        position: { x: 75, y: 15 },
    },
    {
        id: 3,
        name: "INTEGRATION",
        title: "Seamless Integration",
        description: "Integrate AI with minimal disruption to your infrastructure.",
        position: { x: 20, y: 85 },
    },
    {
        id: 4,
        name: "OPTIMIZATION",
        title: "Optimization",
        description: "Refine performance and enhance automation for growth.",
        position: { x: 75, y: 85 },
    }
];

// Scroll distance multiplier
const SCROLL_MULTIPLIER = 2;

// Step 1: Radar Scan Animation Component
const RadarScan = () => {
    return (
        <div className="relative w-full aspect-square max-w-[160px] mx-auto">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-700/50" />
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full border border-gray-700/30" />
            {/* Radar sweep */}
            <motion.div
                className="absolute inset-0 origin-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
                <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-1"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, #a855f7 50%, #7c3aed 100%)',
                        transformOrigin: 'left center',
                        transform: 'translateY(-50%)',
                    }}
                />
                {/* Pie slice */}
                <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                    style={{
                        background: 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.4) 0deg, transparent 45deg)',
                        borderRadius: '0 100% 0 0',
                    }}
                />
            </motion.div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            {/* Label */}
            <p className="absolute -bottom-6 left-0 right-0 text-center text-gray-400 text-xs">
                Analyzing current workflow...
            </p>
        </div>
    );
};

// Step 2: Code Editor Animation Component
const CodeEditor = () => {
    const codeLines = [
        { indent: 0, content: <><span className="text-purple-400">def</span> <span className="text-blue-400">get_status</span><span className="text-yellow-400">(self)</span>:</> },
        { indent: 1, content: <><span className="text-purple-400">return</span> <span className="text-green-400">f"Status: {'{'}self.status{'}'}"</span></> },
        { indent: 0, content: "" },
        { indent: 0, content: <><span className="text-purple-400">class</span> <span className="text-blue-400">AutomationTrigger</span>:</> },
        { indent: 1, content: <><span className="text-gray-400">def __init__(self, threshold):</span></> },
        { indent: 2, content: <span className="text-gray-400">self.threshold = threshold</span> },
        { indent: 2, content: <span className="text-gray-400">self.status = "inactive"</span> },
        { indent: 0, content: "" },
        { indent: 1, content: <><span className="text-purple-400">def</span> <span className="text-blue-400">activate</span><span className="text-yellow-400">(self)</span>:</> },
        { indent: 2, content: <span className="text-gray-400">self.status = "active"</span> },
    ];

    return (
        <div className="bg-black/60 border border-gray-800 rounded-xl overflow-hidden">
            {/* Editor header */}
            <div className="bg-black/80 px-3 py-2 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-xs">←</span>
                    <span className="text-xs">→</span>
                </div>
                <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-800 rounded-full w-16 mx-auto" />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>□</span>
                    <span>—</span>
                    <span>×</span>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="bg-black/40 border-r border-gray-800 p-3 space-y-3">
                    <FileCode className="w-4 h-4 text-gray-500" />
                    <Search className="w-4 h-4 text-gray-500" />
                    <Settings className="w-4 h-4 text-gray-500" />
                </div>

                {/* Code area with infinite scroll animation */}
                <div
                    className="flex-1 p-4 font-mono text-xs overflow-hidden relative h-[140px]"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    }}
                >
                    <div className="animate-code-scroll">
                        {/* Triple repeat for seamless infinite loop */}
                        {[...codeLines, ...codeLines, ...codeLines].map((line, i) => (
                            <div key={i} className="whitespace-nowrap leading-5" style={{ paddingLeft: `${line.indent * 16}px` }}>
                                {line.content || '\u00A0'}
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes codeScroll {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-33.333%); }
                        }
                        .animate-code-scroll {
                            animation: codeScroll 8s linear infinite;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

// Step 3: Integration Animation Component
const IntegrationVisual = () => {
    return (
        <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-2xl p-8 sm:p-10">
            <div className="flex items-center justify-center gap-8">
                {/* Our solution - animated circles */}
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 mx-auto mb-3 flex items-center justify-center"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <motion.div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400/50"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                    <span className="text-gray-400 text-xs">Our solution</span>
                </div>

                {/* Connection dots */}
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        />
                    ))}
                </div>

                {/* Your stack */}
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-violet-900 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-purple-300 text-2xl font-bold">M</span>
                    </motion.div>
                    <span className="text-gray-400 text-xs">Your stack</span>
                </div>
            </div>
        </div>
    );
};

// Step 4: Optimization Status Component
const OptimizationStatus = () => {
    const systems = [
        { icon: MessageSquare, name: "Chatbot system", status: "Efficiency will increase by 20%", statusIcon: "loading" },
        { icon: Workflow, name: "Workflow system", status: "Update available", statusIcon: "up" },
        { icon: TrendingUp, name: "Sales system", status: "Up to date", statusIcon: "check" },
    ];

    return (
        <div className="space-y-3">
            {systems.map((system, idx) => (
                <motion.div
                    key={system.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="bg-black/40 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
                >
                    <div className="w-10 h-10 bg-black/60 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <system.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-medium block">{system.name}</span>
                        <span className="text-gray-500 text-xs">{system.status}</span>
                    </div>
                    <div className="flex-shrink-0">
                        {system.statusIcon === "loading" && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                            </motion.div>
                        )}
                        {system.statusIcon === "up" && <TrendingUp className="w-5 h-5 text-purple-500" />}
                        {system.statusIcon === "check" && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Step check items for Step 1
const step1Items = [
    { icon: Shield, label: "System check" },
    { icon: Box, label: "Process check" },
    { icon: Gauge, label: "Speed check" },
    { icon: FileText, label: "Manual work" },
    { icon: RefreshCcw, label: "Repetitive task" },
];

export const CustomerLifecycleSection = () => {
    const [visibleStages, setVisibleStages] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [smoothProgress, setSmoothProgress] = useState(0);
    const [isFixed, setIsFixed] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    // Continuously update smooth progress
    useEffect(() => {
        let animationId: number;
        const animate = () => {
            setSmoothProgress(prev => {
                const diff = scrollProgress - prev;
                if (Math.abs(diff) < 0.001) return scrollProgress;
                return prev + diff * 0.12;
            });
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [scrollProgress]);

    // Update visible stages based on smooth progress
    useEffect(() => {
        const stagesToShow = Math.floor(smoothProgress * lifecycleStages.length * 1.5);
        const newVisibleStages = lifecycleStages
            .slice(0, Math.min(lifecycleStages.length, stagesToShow + 1))
            .map(stage => stage.id);
        setVisibleStages(newVisibleStages);
    }, [smoothProgress]);

    // Scroll-based progress calculation
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollDistance = windowHeight * SCROLL_MULTIPLIER;

            if (rect.top > 0) {
                setIsFixed(false);
                setIsAtBottom(false);
                setScrollProgress(0);
                return;
            }

            if (rect.bottom <= windowHeight) {
                setIsFixed(false);
                setIsAtBottom(true);
                setScrollProgress(1);
                return;
            }

            const scrolledIntoSection = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolledIntoSection / scrollDistance));

            setIsFixed(true);
            setIsAtBottom(false);
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getContentStyle = (): React.CSSProperties => {
        if (isFixed) {
            return {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '100vh',
                zIndex: 10,
            };
        }

        if (isAtBottom) {
            return {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100vh',
            };
        }

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
        };
    };

    // Render step card for mobile
    const renderStepCard = (step: number) => {
        switch (step) {
            case 1:
                return (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center justify-center py-4">
                            <RadarScan />
                        </div>
                        <div className="space-y-2">
                            {step1Items.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-black/40 border border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2"
                                >
                                    <item.icon className="w-3 h-3 text-gray-400" />
                                    <span className="text-white text-xs">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return <div className="mt-6"><CodeEditor /></div>;
            case 3:
                return <div className="mt-6"><IntegrationVisual /></div>;
            case 4:
                return <div className="mt-6"><OptimizationStatus /></div>;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Mobile: Process Steps Cards */}
            <section id="lifecycle" className="md:hidden bg-[#050505] py-16 px-4">
                <div className="max-w-lg mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Drive value across the{" "}
                            <span className="text-purple-400">customer lifecycle</span>
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Each touchpoint is a revenue opportunity
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div className="space-y-6">
                        {lifecycleStages.map((stage, idx) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10% 0px" }}
                                transition={{ duration: 0.5, delay: 0.1 * idx }}
                                className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-6 sm:p-8"
                            >
                                {/* Step badge */}
                                <span className="inline-block px-4 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 text-sm font-medium mb-6">
                                    Step {stage.id}
                                </span>

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                    {stage.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-base leading-relaxed">
                                    {stage.description}
                                </p>

                                {/* Visual content */}
                                {renderStepCard(stage.id)}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Desktop/Tablet: Fixed scroll-driven animation */}
            <section
                id="lifecycle-desktop"
                ref={containerRef}
                className="hidden md:block relative bg-[#050505]"
                style={{
                    height: `${100 + (100 * SCROLL_MULTIPLIER)}vh`
                }}
            >
                <div
                    className="bg-[#050505]"
                    style={getContentStyle()}
                >
                    <div className="h-full flex items-center justify-center">
                        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className="space-y-8 text-white">
                                <div className="space-y-4">
                                    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                                        Drive value across the{" "}
                                        <span className="text-purple-400">customer lifecycle</span>
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-start gap-3 sm:gap-4 flex-wrap">
                                            <span className="inline-block px-4 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 text-base sm:text-xl font-bold">
                                                Each touchpoint
                                            </span>
                                            <span className="text-xl sm:text-2xl font-bold text-gray-500">=</span>
                                            <span className="inline-block px-4 py-1 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 text-base sm:text-xl font-bold">
                                                Revenue opportunity
                                            </span>
                                        </div>

                                        <p className="text-base sm:text-lg leading-relaxed text-gray-400 max-w-lg">
                                            At each stage, Business Messaging plays a pivotal role,
                                            unblocking cost savings and new revenue opportunities while
                                            emphasizing retention.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Infinity Loop Diagram */}
                            <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] w-full">
                                {/* Infinity Loop Path */}
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    viewBox="0 0 400 300"
                                    style={{
                                        opacity: smoothProgress > 0 ? 1 : 0,
                                        transition: 'opacity 0.8s ease-out'
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                                            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 80 150 C 80 80 160 80 200 150 C 240 220 320 220 320 150 C 320 80 240 80 200 150 C 160 220 80 220 80 150"
                                        fill="none"
                                        stroke="url(#pathGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: 1000,
                                            strokeDashoffset: 1000 - (1000 * smoothProgress),
                                            transition: 'none'
                                        }}
                                    />
                                </svg>

                                {/* Lifecycle Stages - 4 steps */}
                                <AnimatePresence>
                                    {lifecycleStages.map((stage) => (
                                        <motion.div
                                            key={stage.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: visibleStages.includes(stage.id) ? 1 : 0,
                                                scale: visibleStages.includes(stage.id) ? 1 : 0.8
                                            }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="absolute bg-[#0d0d0d] rounded-2xl p-4 sm:p-5 border border-gray-800 shadow-xl backdrop-blur-md"
                                            style={{
                                                left: `${stage.position.x}%`,
                                                top: `${stage.position.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                width: '260px',
                                                zIndex: 20
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-1 rounded">
                                                    Step {stage.id}
                                                </div>
                                            </div>
                                            <div className="text-sm sm:text-base font-bold text-white mb-2">
                                                {stage.title}
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {stage.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CustomerLifecycleSection;
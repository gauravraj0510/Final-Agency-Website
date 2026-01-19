import React from "react";

const LogoMarquee: React.FC = () => {
  const logos = [
    { name: "Logoipsum", icon: "◆" },
    { name: "Logoipsum", icon: "✦" },
    { name: "Logoipsum", icon: "◉" },
    { name: "Logoipsum", icon: "⬡" },
    { name: "Logoipsum", icon: "◈" },
    { name: "Logoipsum", icon: "✧" },
    { name: "Logoipsum", icon: "◎" },
    { name: "Logoipsum", icon: "⬢" },
  ];

  // Duplicate once for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="relative pt-[12rem] pb-0 bg-[#050505] overflow-hidden">
      {/* Heading */}
      <p className="text-center text-white text-lg mb-6 tracking-wide">
        Over 50+ businesses trust us
      </p>

      {/* Marquee wrapper */}
      <div className="relative max-w-4xl mx-auto overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent" />

        {/* Moving track */}
        <div className="flex w-max animate-marquee">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mx-10 shrink-0 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <span className="text-xl">{logo.icon}</span>
              <span className="text-base font-medium whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 22s linear infinite;
          will-change: transform;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoMarquee;

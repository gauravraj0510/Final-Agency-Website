import React from 'react';

// Service Data
const services = [
  {
    title: 'Web Development',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    description: 'Scalable full-stack applications built with modern technologies.',
    color: 'from-violet-600 to-purple-600',
  },
  {
    title: 'Mobile Apps',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Native and cross-platform mobile solutions for iOS & Android.',
    color: 'from-pink-600 to-rose-600',
  },
  {
    title: 'AI & ML',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Intelligent automation and data-driven insights for your business.',
    color: 'from-cyan-600 to-teal-600',
  },
  {
    title: 'UI/UX Design',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    description: 'User-centric design creating engaging and intuitive digital experiences.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    title: 'Cloud Solutions',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    description: 'Secure and scalable cloud infrastructure on AWS, Azure, or GCP.',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'DevOps',
    icon: (
      <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    description: 'Streamlined CI/CD pipelines and automated deployment workflows.',
    color: 'from-emerald-600 to-green-600',
  },
];

const Services: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden flex flex-col items-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px]" />

        {/* Honeycomb Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23a855f7' stroke-width='1' fill='none'/%3E%3Cpath d='M30 104l25.98-15V59L30 44 4.02 59v30z' fill-rule='evenodd' stroke='%23a855f7' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 104px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-white">Our </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400">
              Services
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive technical solutions designed to scale your business.
          </p>
        </div>

        {/* Honeycomb Grid Container */}
        <div className="flex justify-center pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative w-[300px] h-[340px] flex items-center justify-center transition-all duration-300 hover:-translate-y-2"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  // Optional: Add staggering for true honeycomb look if desired, requires complex grid/margin logic
                  // For now, consistent grid looks cleanest
                }}
              >
                {/* Active background with gradient border */}
                <div
                  className="absolute inset-[1px] bg-[#0a0a0a]/90 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#111]"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${service.color}`} />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center px-10">
                    <div className={`mb-5 p-4 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-purple-500/30`}>
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Border Gradient */}
                <div
                  className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-purple-500 group-hover:to-violet-500 transition-all duration-300 animate-pulse-purple"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

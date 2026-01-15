import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 pointer-events-auto">
      {/* Logo */}
      <div className="pl-4 pr-2 text-lg font-medium tracking-tight text-white flex items-center gap-1">
        <span className="font-serif italic text-xl">⌘</span> Delphi
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-white/10 mx-2 hidden md:block" />

      {/* Links */}
      <div className="hidden md:flex items-center gap-6 px-2">
        {['Services', 'Case Studies', 'About'].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-white"
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="ml-2">
        <button className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25">
          Get started
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
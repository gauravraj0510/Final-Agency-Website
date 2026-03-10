import React, { useState } from 'react';

const NAV_ITEMS = ['Offerings', 'Credibility', 'Case Studies'];

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 pointer-events-auto w-[calc(100%-3rem)] max-w-4xl md:w-auto justify-between md:justify-start">
        {/* Logo */}
        <div className="pl-4 pr-2 text-lg font-medium tracking-tight text-white flex items-center gap-1">
          <span className="font-serif italic text-xl">⌘</span> Avelix
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-2 hidden md:block" />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 px-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA + Mobile menu button */}
        <div className="flex items-center gap-2 mr-2 md:ml-2">
          <a
            href="https://wa.me/919136239673?text=Hey%20I%20want%20to%20automate%20my%20workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get started
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden
      />

      {/* Mobile sidebar panel */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[min(100vw-4rem,20rem)] bg-[#0a0a0a] border-l border-white/10 shadow-xl md:hidden transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute top-6 right-6 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={closeMobileMenu}
                className="py-3 px-4 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <a
              href="https://wa.me/919136239673?text=Hey%20I%20want%20to%20automate%20my%20workflow"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="flex justify-center px-5 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 transition-all"
            >
              Get started
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
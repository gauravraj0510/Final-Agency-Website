import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, getIdToken, signInWithGoogle } from '../lib/firebase-client';

const API_BASE =
  typeof import.meta.env?.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "https://final-agency-website.vercel.app";

interface NavItem {
  readonly label: string;
  readonly href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Offerings', href: '/offerings' },
  { label: 'Credibility', href: '/#credibility' },
  { label: 'Case Studies', href: '/#case-studies' },
];

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [analysisDocId, setAnalysisDocId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setAnalysisDocId(null);
        return;
      }
      void lookupAnalysis();
    });
    return unsubscribe;
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lookupAnalysis = async () => {
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/api/lookup-analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setAnalysisDocId(null);
        return;
      }
      const data = await res.json();
      if (data.ok && data.docId) {
        setAnalysisDocId(data.docId);
      }
    } catch {
      setAnalysisDocId(null);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut(auth);
    setUser(null);
    setAnalysisDocId(null);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const userInitial = user?.displayName?.[0] ?? user?.email?.[0] ?? "U";
  const userPhoto = user?.photoURL;

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 pointer-events-auto w-[calc(100%-3rem)] max-w-4xl md:w-auto justify-between md:justify-start">
        {/* Logo */}
        <a href="/" className="pl-3 pr-2 flex items-center no-underline">
          <img src="/logo-full-dark.png" alt="Avelix" className="h-[34px] object-contain" />
        </a>

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-2 hidden md:block" />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 px-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA + Mobile menu + User avatar */}
        <div className="flex items-center gap-2 mr-2 md:ml-2">
          <a
            href="https://wa.me/919136239673?text=Hey%20I%20want%20to%20automate%20my%20workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 items-center gap-1 group bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get started
          </a>

          {/* Login icon (desktop) - shown when logged out */}
          {!user && (
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/20 hover:border-purple-400/50 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              aria-label="Sign in"
              title="Sign in with Google"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
          )}

          {/* User avatar dropdown (desktop) - rightmost */}
          {user && (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-purple-400/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                aria-label="User menu"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-semibold text-white bg-purple-600 w-full h-full flex items-center justify-center uppercase">
                    {userInitial}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-[80]">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">
                      {user.displayName ?? "User"}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {user.email}
                    </p>
                  </div>

                  {analysisDocId && (
                    <a
                      href={`/analysis/${analysisDocId}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                      Snapshot Report
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

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
        <div className="flex flex-col h-full px-6 pb-8">
          {/* Header: logo + close button */}
          <div className="flex items-center justify-between pt-6 pb-6 border-b border-white/10 mb-4">
            <img src="/logo-full-dark.png" alt="Avelix" className="h-12 object-contain" />
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="py-3 px-4 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile sign-in */}
          {!user && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => { closeMobileMenu(); void signInWithGoogle(); }}
                className="w-full flex items-center gap-2.5 py-3 px-4 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Sign in
              </button>
            </div>
          )}

          {/* Mobile user section */}
          {user && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-1">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                  {userPhoto ? (
                    <img src={userPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-semibold text-white bg-purple-600 w-full h-full flex items-center justify-center uppercase">
                      {userInitial}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.displayName ?? "User"}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>

              {analysisDocId && (
                <a
                  href={`/analysis/${analysisDocId}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2.5 py-3 px-4 rounded-lg text-base font-medium text-purple-300 hover:text-white hover:bg-purple-500/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Snapshot Report
                </a>
              )}

              <button
                type="button"
                onClick={() => { closeMobileMenu(); void handleLogout(); }}
                className="w-full flex items-center gap-2.5 py-3 px-4 rounded-lg text-base font-medium text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Log out
              </button>
            </div>
          )}

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

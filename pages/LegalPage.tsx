import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useDocumentMeta } from "../lib/useDocumentMeta";

interface LegalPageProps {
  readonly title: string;
  readonly description?: string;
  readonly canonical?: string;
  readonly children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({
  title,
  description,
  canonical,
  children,
}) => {
  useDocumentMeta({
    title: `${title} — Avelix`,
    description,
    canonical,
  });

  return (
  <div className="min-h-screen bg-[#050505] text-white">
    <Navigation />
    <main className="pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-gray-500">
          {title}
        </h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white/90 [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-purple-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-white [&_strong]:text-white/90 [&_table]:w-full [&_th]:text-left [&_th]:text-white/80 [&_th]:pb-2 [&_th]:border-b [&_th]:border-white/10 [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-white/5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default LegalPage;

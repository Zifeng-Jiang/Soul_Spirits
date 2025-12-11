
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 text-center relative overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 blur-3xl -z-10" />
      <h1 className="text-4xl md:text-6xl font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple mb-2 pb-4 leading-tight">
        Soul Spirits
      </h1>
      <p className="text-slate-400 text-sm md:text-base tracking-widest uppercase">
        AI Mixology & Personality Profiling
      </p>
    </header>
  );
};

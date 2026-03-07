import React from 'react';
import PokemonList from '../components/PokemonList';

const Dashboard: React.FC = () => (
  <div className="min-h-screen">
    {/* Header */}
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Pokeball SVG icon */}
          <svg width="28" height="28" viewBox="0 0 100 100" className="opacity-70">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
            <path d="M 2 50 A 48 48 0 0 1 98 50" fill="rgba(255,60,60,0.5)" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
            <path d="M 2 50 A 48 48 0 0 0 98 50" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
            <circle cx="50" cy="50" r="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
            <circle cx="50" cy="50" r="6" fill="rgba(255,255,255,0.7)"/>
          </svg>
          <div>
            <h1 className="font-display text-2xl tracking-[0.2em] text-white/90 leading-none">
              POKÉDEX
            </h1>
            <p className="text-[10px] font-mono text-white/25 tracking-widest leading-none mt-0.5">
              DASHBOARD
            </p>
          </div>
        </div>
      </div>
    </header>

    {/* Main */}
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      <PokemonList />
    </main>
  </div>
);

export default Dashboard;

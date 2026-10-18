'use client';

import React from 'react';
import { Search, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Semantic vector search across contracts & invoices..."
          className="w-full bg-slate-900/60 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Engine Status Indicators */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <Database className="w-3 h-3 text-cyan-400" />
          <span>Hybrid RRF: <strong className="text-white">0.7 Vector + 0.3 Lexical</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SHA-256 Proofs Enabled</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
            CA
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white">Compliance Auditor</div>
            <div className="text-[10px] text-cyan-400 font-mono">Enterprise Level 3</div>
          </div>
        </div>
      </div>
    </header>
  );
};

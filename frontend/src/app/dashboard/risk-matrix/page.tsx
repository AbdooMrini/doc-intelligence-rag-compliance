'use client';

import React, { useState, useEffect } from 'react';
import { DocIntelligenceApi } from '../../../lib/api';
import { RiskFinding } from '../../../lib/types';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  Search, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function RiskMatrixPage() {
  const [risks, setRisks] = useState<RiskFinding[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    DocIntelligenceApi.getAllRisks().then(setRisks);
  }, []);

  const filtered = risks.filter((r) => {
    const matchSev = filterSeverity === 'ALL' || r.severity === filterSeverity;
    const matchCat = filterCategory === 'ALL' || r.riskCategory === filterCategory;
    return matchSev && matchCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span>Legal & Financial Risk Matrix</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous detection of contractual liabilities, auto-renewal traps, payment term delays, and tax anomalies.
          </p>
        </div>

        {/* Severity Filter Badges */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'ALL'
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All Risks ({risks.length})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'HIGH'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            High ({risks.filter((r) => r.severity === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilterSeverity('MEDIUM')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterSeverity === 'MEDIUM'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Medium ({risks.filter((r) => r.severity === 'MEDIUM').length})
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'LEGAL', 'FINANCIAL', 'COMPLIANCE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {cat} CATEGORY
          </button>
        ))}
      </div>

      {/* Risk Cards Grid */}
      <div className="grid gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                  r.severity === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {r.severity} • {r.riskCategory}
                </span>
                <h3 className="text-sm font-bold text-white">{r.title}</h3>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Page {r.pageNumber}
                </span>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Confidence: {Math.round(r.confidenceScore * 100)}%
                </span>
              </div>
            </div>

            {/* Extracted Clause */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                Extracted Clause Snippet:
              </span>
              <p className="text-xs text-slate-300 italic bg-slate-950/70 p-3 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed">
                &ldquo;{r.clauseSnippet}&rdquo;
              </p>
            </div>

            {/* Explanation and Remediation */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-rose-400 font-semibold block mb-1">Risk Exposure Assessment:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{r.riskExplanation}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">Legal Remediation Advice:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{r.recommendation}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
              <span>Citation Cryptographic Hash: <code className="text-cyan-300">{r.citationHash.substring(0, 32)}...</code></span>
              <span className="text-emerald-400">Verifiable Grounding</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

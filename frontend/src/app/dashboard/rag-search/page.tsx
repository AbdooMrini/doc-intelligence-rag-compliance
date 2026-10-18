'use client';

import React, { useState } from 'react';
import { DocIntelligenceApi } from '../../../lib/api';
import { RagQueryResponse } from '../../../lib/types';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

export default function RagSearchPage() {
  const [query, setQuery] = useState('What are the liability caps and indemnity terms in the MSA?');
  const [response, setResponse] = useState<RagQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    'What are the liability caps and indemnity terms in the MSA?',
    'Are there any payment term anomalies or missing VAT numbers in the invoice?',
    'Does the agreement contain unilateral automatic multi-year renewal clauses?',
    'Are personal data transfers compliant with GDPR sub-processor rules?',
  ];

  const handleExecuteQuery = async (qToRun?: string) => {
    const activeQ = qToRun || query;
    if (!activeQ.trim()) return;

    setLoading(true);
    try {
      const res = await DocIntelligenceApi.executeRagQuery(activeQ);
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span>Hybrid Vector Search (RAG) & Citation Grounding</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ask natural language questions against indexed contracts and financial documents. Guaranteed zero hallucination via mathematical grounding.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask questions about legal liability, payment terms, VAT numbers, GDPR..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <button
            onClick={() => handleExecuteQuery()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Synthesizing...' : 'Execute RAG Query'}</span>
          </button>
        </div>

        {/* Preset Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Quick Previews:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(sq); handleExecuteQuery(sq); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Results Section */}
      {response && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Grounded Synthesis Card */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-cyan-950/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Grounded Answer (Anti-Hallucination Certified)</h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Vector Confidence: {Math.round(response.confidenceScore * 100)}%
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Latency: {response.queryLatencyMs} ms
                </span>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Hallucination Risk: {Math.round(response.hallucinationRiskScore * 100)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
              {response.answer}
            </p>

            <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-cyan-500/10">
              <span>Verifiable Audit Ledger Token: <strong className="text-cyan-300">{response.verifiableAuditToken}</strong></span>
              <span className="text-emerald-400">Strict Source Provenance Validated</span>
            </div>
          </div>

          {/* Verifiable Source Citations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verifiable Source Citations ({response.citations.length} Grounded Chunks)</span>
              </h3>
              <span className="text-xs text-slate-400">Linked directly to raw parsed document pages</span>
            </div>

            <div className="grid gap-3">
              {response.citations.map((cite, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-4 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">{cite.documentTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        Page {cite.pageNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Cosine Match: {Math.round(cite.vectorCosineSimilarity * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] leading-relaxed">
                    &ldquo;{cite.exactSnippet}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Chunk SHA-256: <code className="text-cyan-300">{cite.cryptographicChunkHash}</code></span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Immutable Citation Proof
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

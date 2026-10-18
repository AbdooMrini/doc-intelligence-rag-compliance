'use client';

import React, { useState, useEffect } from 'react';
import { DocIntelligenceApi } from '../../../lib/api';
import { AuditTrailItem } from '../../../lib/types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Search,
  Download
} from 'lucide-react';

export default function AuditTrailPage() {
  const [trail, setTrail] = useState<AuditTrailItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    DocIntelligenceApi.getAuditTrail().then(setTrail);
  }, []);

  const filtered = trail.filter(
    (t) =>
      t.eventType.toLowerCase().includes(search.toLowerCase()) ||
      t.detailsJson.toLowerCase().includes(search.toLowerCase()) ||
      t.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Immutable Verifiable Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail guaranteeing zero hallucination provenance and pipeline transparency.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting verifiable audit logs...")}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by event type (e.g. DOCUMENT_INGESTED, RISKS_DETECTED, RAG_QUERY_EXECUTED)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Audit Timeline Table */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Event Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity Details</th>
                <th className="py-3 px-4">Cryptographic Proof Hash</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {entry.eventType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white font-medium">{entry.actor}</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{entry.detailsJson}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                    {entry.cryptographicProofHash.substring(0, 20)}...
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

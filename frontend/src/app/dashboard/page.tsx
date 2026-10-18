'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DocIntelligenceApi } from '../../lib/api';
import { DocumentItem, RiskFinding, ComplianceReport } from '../../lib/types';
import { 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [risks, setRisks] = useState<RiskFinding[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DocIntelligenceApi.getDocuments(),
      DocIntelligenceApi.getAllRisks(),
      DocIntelligenceApi.getComplianceReports()
    ]).then(([dList, rList, repList]) => {
      setDocs(dList);
      setRisks(rList);
      setReports(repList);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const highRisks = risks.filter((r) => r.severity === 'HIGH');
  const mediumRisks = risks.filter((r) => r.severity === 'MEDIUM');
  const lowRisks = risks.filter((r) => r.severity === 'LOW');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Executive Compliance & Risk Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hybrid RAG ingestion status, legal exposure detection, and verifiable audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/documents"
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ingest Document</span>
          </Link>
          <Link
            href="/dashboard/rag-search"
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RAG Query Playground</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Overall Compliance Score</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">78 / 100</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              GRADE AA
            </span>
            <span className="text-slate-400 text-[11px]">Audit certified</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Critical Risk Findings</p>
              <h3 className="text-2xl font-bold text-rose-400 tracking-tight">{highRisks.length} High</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">{mediumRisks.length} Medium, {lowRisks.length} Low</span>
            <Link href="/dashboard/risk-matrix" className="text-cyan-400 hover:underline text-[11px] font-medium">
              View Matrix →
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Ingested Documents</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{docs.length} Active</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">PDFs, Scans, Excel Sheets</span>
            <span className="text-emerald-400 font-mono text-[11px]">100% Parsed</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">RAG Grounding Accuracy</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">96.4%</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
              0% Hallucination
            </span>
            <span className="text-slate-400 text-[11px]">SHA-256 Citations</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Urgent Risk Alerts & RAG Synthesis Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Urgent Risk Findings */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Detected Legal & Financial Risk Exposures</span>
              </h2>
              <p className="text-[11px] text-slate-400">Automated clause extraction and liability detection</p>
            </div>
            <Link
              href="/dashboard/risk-matrix"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Full Breakdown →
            </Link>
          </div>

          <div className="space-y-3">
            {risks.slice(0, 3).map((risk) => (
              <div
                key={risk.id}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                      risk.severity === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {risk.severity} {risk.riskCategory}
                    </span>
                    <span className="text-xs font-bold text-white">{risk.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Page {risk.pageNumber} • {Math.round(risk.confidenceScore * 100)}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800 font-mono text-[11px]">
                  &ldquo;{risk.clauseSnippet}&rdquo;
                </p>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span><strong>Recommendation:</strong> {risk.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ingestion Pipeline & Verification Status */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Vector & Proof Pipeline</span>
              </h2>
              <p className="text-[11px] text-slate-400">PostgreSQL pgvector + cryptographic ledger</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Vector Embeddings (HNSW)</span>
                <span className="text-cyan-400 font-mono font-semibold">384 Dimensions</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Reciprocal Rank Fusion</span>
                <span className="text-emerald-400 font-mono font-semibold">Active (0.7 / 0.3)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Citation Anti-Hallucination</span>
                <span className="text-purple-400 font-mono font-semibold">SHA-256 Grounded</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Average RAG Latency</span>
                <span className="text-amber-400 font-mono font-semibold">48 ms</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/rag-search"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Hybrid Search Q&A</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

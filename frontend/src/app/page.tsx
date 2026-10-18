'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  FileCheck2,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">DocIntelligence</span>
              <span className="text-cyan-400 font-bold text-base">RAG</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#pipeline" className="hover:text-white transition-colors">Ingestion Pipeline</a>
            <a href="#rag" className="hover:text-white transition-colors">Hybrid Vector Search</a>
            <a href="#risks" className="hover:text-white transition-colors">Risk Detection</a>
            <a href="#audit" className="hover:text-white transition-colors">Verifiable Audit Trails</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/rag-search"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              RAG Playground
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Compliance Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 text-center">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Enterprise B2B Document Intelligence & RAG Compliance</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Automated Legal & Financial Risk Analysis with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300">
              Verifiable RAG Grounding
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Ingest heterogeneous contracts, commercial invoices, and specifications (PDFs, scans, Excel).
            Execute hybrid vector search with confidence scoring and generate cryptographically verifiable audit trails to eliminate AI hallucinations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-sm font-semibold shadow-xl shadow-cyan-600/30 transition-all flex items-center gap-2"
            >
              <span>Launch Compliance Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/rag-search"
              className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Test Hybrid Vector Search</span>
            </Link>
          </div>

          {/* Architecture Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800">Next.js 14 App Router</span>
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800">Spring Boot 3.3 & Java 21</span>
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800">PostgreSQL pgvector</span>
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800">Apache PDFBox & POI</span>
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800">SHA-256 Provenance</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="pipeline" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Engineered for Zero AI Hallucinations</h2>
          <p className="text-sm text-slate-400">Strict mathematical grounding, semantic vectors, and immutable cryptographic proofs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Heterogeneous Ingestion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Handles multi-format contracts (PDFs via PDFBox), commercial spreadsheets (Excel via POI), 
              and scanned documents with sliding-window semantic chunking and per-chunk SHA-256 fingerprinting.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hybrid Vector RAG Search</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reciprocal Rank Fusion combining PostgreSQL <code className="text-cyan-300 font-mono text-[11px]">pgvector</code> cosine distance 
              with full-text BM25 keyword matching for optimal retrieval accuracy.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Legal & Financial Risk Detection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flags unlimited liability, auto-renewal traps, Net-90 extended payment terms, missing VAT identifiers, 
              and GDPR cross-border transfer violations with confidence scores.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verifiable Audit Trails</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminates AI hallucinations by binding every insight to an exact document quote, page number, 
              chunk ID, and tamper-evident SHA-256 cryptographic hash.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Compliance Scorecards</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated compliance grades (AAA to F) with granular score breakdowns, remediation advice, 
              and one-click signed audit report exports for executive legal teams.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Enterprise Docker Stack</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Containerized Spring Boot 3.3 Java backend, PostgreSQL 16 with pgvector extension, 
              and Next.js 14 frontend ready for production cluster deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-400">
        <p>Enterprise Document Intelligence & RAG Compliance Engine • Spring Boot 3.3, Next.js 14, and PostgreSQL pgvector</p>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  FileCheck2, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Document Ingestion', href: '/dashboard/documents', icon: FileText },
  { name: 'Hybrid RAG Playground', href: '/dashboard/rag-search', icon: Sparkles },
  { name: 'Legal & Financial Risks', href: '/dashboard/risk-matrix', icon: AlertTriangle },
  { name: 'Compliance Reports', href: '/dashboard/audit-reports', icon: FileCheck2 },
  { name: 'Verifiable Audit Trail', href: '/dashboard/audit-trail', icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-bold">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">DOC INTELLIGENCE</h1>
            <p className="text-[10px] text-cyan-400 font-mono">RAG COMPLIANCE ENGINE</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">PostgreSQL pgvector</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              384-dim HNSW
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Anti-Hallucination</span>
            <span className="text-cyan-400 font-mono text-[11px]">Grounded 96.4%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

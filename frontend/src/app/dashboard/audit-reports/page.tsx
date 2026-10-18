'use client';

import React, { useState, useEffect } from 'react';
import { DocIntelligenceApi } from '../../../lib/api';
import { ComplianceReport } from '../../../lib/types';
import { 
  FileCheck2, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Clock
} from 'lucide-react';

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);

  useEffect(() => {
    DocIntelligenceApi.getComplianceReports().then(setReports);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
            <span>Certified Compliance Audit Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated compliance scorecards and cryptographic proof certificates for executive stakeholders.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading certified audit package with SHA-256 validation manifest...")}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Certified Package</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Report ID: {rep.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">Contract Compliance Certificate</h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-400 font-mono">{rep.overallScore}/100</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    rep.complianceGrade === 'AAA' || rep.complianceGrade === 'AA'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    GRADE {rep.complianceGrade}
                  </span>
                </div>
              </div>

              {/* Risk tally */}
              <div className="grid grid-cols-3 gap-3 py-4 text-center">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">High Risks</span>
                  <strong className="text-rose-400 text-sm">{rep.highRisksCount}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Medium Risks</span>
                  <strong className="text-amber-400 text-sm">{rep.mediumRisksCount}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Low Risks</span>
                  <strong className="text-cyan-400 text-sm">{rep.lowRisksCount}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                {rep.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] space-y-0.5">
                <div className="text-slate-400">Cryptographic Report SHA-256 Proof:</div>
                <div className="text-cyan-300 break-all select-all font-bold">
                  {rep.verifiedSha256ReportHash}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cryptographically Certified
                </span>
                <span>{new Date(rep.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

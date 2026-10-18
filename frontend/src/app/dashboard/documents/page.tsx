'use client';

import React, { useState, useEffect } from 'react';
import { DocIntelligenceApi } from '../../../lib/api';
import { DocumentItem } from '../../../lib/types';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  FileSpreadsheet, 
  Scan, 
  Layers, 
  ShieldCheck, 
  RefreshCw,
  Plus
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    DocIntelligenceApi.getDocuments().then(setDocuments);
  }, []);

  const handleSimulatedUpload = (fileType: 'PDF' | 'EXCEL' | 'SCAN') => {
    setIsUploading(true);
    setTimeout(() => {
      const names = {
        PDF: 'Vendor_Master_SLA_2026.pdf',
        EXCEL: 'Annual_Consulting_Invoice_Ledger.xlsx',
        SCAN: 'Signed_Regulatory_DPA_Scan.pdf',
      };

      const newDoc: DocumentItem = {
        id: `doc_${Date.now()}`,
        title: names[fileType].replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        fileName: names[fileType],
        fileType: fileType,
        fileSizeBytes: 1845200,
        hashSha256: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
        status: 'INDEXED',
        totalPages: fileType === 'PDF' ? 12 : fileType === 'EXCEL' ? 3 : 6,
        summary: `Heterogeneous ingestion completed: parsed with ${fileType === 'PDF' ? 'PDFBox' : fileType === 'EXCEL' ? 'POI' : 'OCR'} into semantic chunks with SHA-256 hashes.`,
        uploadedAt: new Date().toISOString(),
      };

      setDocuments([newDoc, ...documents]);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Heterogeneous Document Ingestion Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-format parser engine extracting text, financial tables, and metadata (PDF, Excel, Scan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulatedUpload('PDF')}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Upload Contract (PDF)</span>
          </button>
          <button
            onClick={() => handleSimulatedUpload('EXCEL')}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Upload Invoice (Excel)</span>
          </button>
        </div>
      </div>

      {/* Drag and Drop Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulatedUpload('PDF'); }}
        className={`glass-card rounded-2xl p-8 border-2 border-dashed text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
          <Upload className={`w-6 h-6 ${isUploading ? 'animate-bounce text-cyan-300' : ''}`} />
        </div>
        <h3 className="text-sm font-bold text-white">
          {isUploading ? 'Executing Semantic Parsing & Vector Embedding Pipeline...' : 'Drag & Drop Enterprise Contracts, Invoices, or Specifications'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Supported formats: PDF (Apache PDFBox parser), Excel XLSX/XLS/CSV (Apache POI tabular parser), and Scanned Images.
        </p>
      </div>

      {/* Ingested Documents List */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-white">
            Ingested Documents Repository ({documents.length})
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            All Chunks Cryptographically Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Pages / Sheets</th>
                <th className="py-3 px-4">SHA-256 Provenance</th>
                <th className="py-3 px-4">Parsing Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {doc.fileType === 'EXCEL' ? (
                        <FileSpreadsheet className="w-4 h-4 text-teal-400 shrink-0" />
                      ) : doc.fileType === 'SCAN' ? (
                        <Scan className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span>{doc.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.fileName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.fileType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {doc.totalPages} {doc.fileType === 'EXCEL' ? 'sheets' : 'pages'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                    {doc.hashSha256.substring(0, 16)}...
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      INDEXED (pgvector)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href="/dashboard/rag-search"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Query in RAG →
                    </a>
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

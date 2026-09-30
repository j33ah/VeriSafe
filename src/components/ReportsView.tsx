import React, { useState } from 'react';
import { FileText, Search, Filter, Trash2, Download, ShieldAlert, ShieldCheck, AlertTriangle, Printer } from 'lucide-react';
import { ScanResult, ScanType, RiskLevel, User } from '../types';

interface ReportsViewProps {
  reports: (ScanResult & { userEmail?: string; userName?: string })[];
  currentUser?: User | null;
  onDeleteReport: (id: string) => void;
  onViewReport: (report: ScanResult) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  currentUser,
  onDeleteReport,
  onViewReport,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.threatCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || r.scanType === typeFilter;
    const matchesRisk = riskFilter === 'ALL' || r.riskLevel === riskFilter;

    return matchesSearch && matchesType && matchesRisk;
  });

  const handlePrintExecutiveSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
              <FileText className="w-7 h-7 text-cyan-400" />
              <span>Threat Intelligence Database Reports</span>
            </h2>
            {currentUser?.role === 'admin' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase">
                ADMIN MASTER VIEW
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                USER ISOLATED VAULT
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {currentUser?.role === 'admin'
              ? `Master Audit Trail: Viewing all ${reports.length} scan records across all platform users.`
              : `Isolated Security Vault: Showing personal scan records for ${currentUser?.email || 'Logged User'}.`}
          </p>
        </div>

        <button
          onClick={handlePrintExecutiveSummary}
          className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Export Executive PDF</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl glass-panel border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search threats, URLs, domains, categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Scan Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
          >
            <option value="ALL">All Scan Types</option>
            <option value="whatsapp">WhatsApp Scams</option>
            <option value="url">Phishing Links</option>
            <option value="screenshot">Payment Receipts</option>
            <option value="call">Spam Calls</option>
            <option value="email">Phishing Emails</option>
            <option value="transaction">Transaction Fraud</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="DANGEROUS">DANGEROUS (High Risk)</option>
            <option value="WARNING">WARNING (Medium Risk)</option>
            <option value="SAFE">SAFE (Verified Safe)</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="p-6 rounded-3xl glass-panel border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Title / Payload</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                    No matching threat reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rpt) => (
                  <tr key={rpt.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(rpt.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase font-mono text-cyan-400">
                      {rpt.scanType}
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-sm truncate text-slate-100">
                      {rpt.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {rpt.threatCategory}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        rpt.riskLevel === 'DANGEROUS'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : rpt.riskLevel === 'WARNING'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {rpt.riskLevel} ({rpt.riskScore}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReport(rpt)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onDeleteReport(rpt.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

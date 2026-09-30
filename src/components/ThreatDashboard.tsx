import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DashboardStats, ScanResult } from '../types';

interface ThreatDashboardProps {
  stats: DashboardStats;
  recentReports: ScanResult[];
  onViewReport: (report: ScanResult) => void;
}

export const ThreatDashboard: React.FC<ThreatDashboardProps> = ({
  stats,
  recentReports,
  onViewReport,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans */}
        <div className="p-5 rounded-2xl glass-panel border-cyan-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Scans Processed</p>
            <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
              {stats.totalScans.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +14.2% from last week
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Threats */}
        <div className="p-5 rounded-2xl glass-panel border-red-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Threats Flagged Today</p>
            <h3 className="text-2xl font-black text-red-400 font-mono mt-1">
              {stats.todayThreats.toLocaleString()}
            </h3>
            <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
              <ShieldAlert className="w-3 h-3" /> Real-time active alerts
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Blocked Scams */}
        <div className="p-5 rounded-2xl glass-panel border-blue-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Scams Blocked</p>
            <h3 className="text-2xl font-black text-blue-400 font-mono mt-1">
              {stats.blockedScams.toLocaleString()}
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> Shield protection level
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Detection Accuracy */}
        <div className="p-5 rounded-2xl glass-panel border-purple-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Gemini Model Accuracy</p>
            <h3 className="text-2xl font-black text-purple-300 font-mono mt-1">
              {stats.detectionAccuracy}%
            </h3>
            <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 mt-1">
              <Users className="w-3 h-3" /> Gemini 3.6 Flash Verified
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Threat Vectors Distribution (Pie) */}
        <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Threat Categories
            </h4>
            <span className="text-[10px] text-cyan-400 font-mono">Live DB</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.threatTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {stats.threatTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
            {stats.threatTypes.map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-slate-300 truncate">{t.name}: {t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly Scams Intercepted (Line) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Threat Volume Over Time
            </h4>
            <span className="text-[10px] text-cyan-400 font-mono">2026 Monthly Trend</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090D16',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="whatsapp" stroke="#22D3EE" strokeWidth={2} name="WhatsApp" />
                <Line type="monotone" dataKey="url" stroke="#3B82F6" strokeWidth={2} name="Links" />
                <Line type="monotone" dataKey="screenshot" stroke="#7C3AED" strokeWidth={2} name="Screenshots" />
                <Line type="monotone" dataKey="email" stroke="#EF4444" strokeWidth={2} name="Emails" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Threat Reports Log */}
      <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-100">Live Global Threat Logs</h4>
            <p className="text-xs text-slate-400">Real-time scan outputs stored in database</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            {recentReports.length} Scans Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Scan Type</th>
                <th className="py-3 px-4">Target / Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentReports.slice(0, 8).map((rpt) => (
                <tr key={rpt.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {new Date(rpt.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-semibold uppercase font-mono text-cyan-400">
                    {rpt.scanType}
                  </td>
                  <td className="py-3.5 px-4 font-medium max-w-xs truncate text-slate-200">
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
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onViewReport(rpt)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all text-xs font-medium"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

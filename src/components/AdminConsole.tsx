import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Mail, CheckCircle2, AlertTriangle, Trash2, Search, ArrowUpRight, Lock, Database, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { User, ScanResult, ContactMessage } from '../types';

interface AdminUser extends User {
  totalScans: number;
  dangerousScans: number;
}

interface AdminConsoleProps {
  currentUser: User | null;
  onSelectUserForScans?: (userId: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ currentUser, onSelectUserForScans }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'scans' | 'contacts' | 'telemetry'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<(ScanResult & { userEmail?: string; userName?: string })[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>('');
  const [scanSearch, setScanSearch] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [uRes, rRes, cRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/reports?role=admin'),
        fetch('/api/admin/contacts')
      ]);

      if (uRes.ok) setUsers(await uRes.json());
      if (rRes.ok) setReports(await rRes.json());
      if (cRes.ok) setContacts(await cRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setActionMessage(`User role updated to ${newRole.toUpperCase()}`);
        setTimeout(() => setActionMessage(''), 3000);
        fetchData();
      }
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        setActionMessage('Scan report permanently removed by Admin.');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(scanSearch.toLowerCase()) ||
    r.threatCategory.toLowerCase().includes(scanSearch.toLowerCase()) ||
    (r.userEmail || '').toLowerCase().includes(scanSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950 border border-amber-500/40 p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Master Control Console
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
              SentinelAI Admin Operations
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Centralized security telemetry, user access control, isolated scan database auditing, and platform incident logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Logged in Admin</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{currentUser?.email || 'admin@sentinel.ai'}</span>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase block">Total System Users</span>
            <span className="text-3xl font-black text-slate-100 mt-1 block">{users.length}</span>
            <span className="text-[11px] text-amber-400 font-mono mt-1 block">
              {users.filter(u => u.role === 'admin').length} Admins • {users.filter(u => u.role === 'user').length} Users
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase block">Total Scans Audited</span>
            <span className="text-3xl font-black text-cyan-400 mt-1 block">{reports.length}</span>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">Across all user profiles</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase block">High-Risk Fraud Items</span>
            <span className="text-3xl font-black text-rose-400 mt-1 block">
              {reports.filter(r => r.riskLevel === 'DANGEROUS').length}
            </span>
            <span className="text-[11px] text-rose-300 font-mono mt-1 block">Flagged for threat database</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase block">Contact & Inquiries</span>
            <span className="text-3xl font-black text-blue-400 mt-1 block">{contacts.length}</span>
            <span className="text-[11px] text-blue-300 font-mono mt-1 block">User feedback submissions</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scans')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'scans'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Master Scan Logs ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'contacts'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Support Inquiries ({contacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'telemetry'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>System Storage Telemetry</span>
        </button>
      </div>

      {/* Tab 1: User Database Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <button
              onClick={fetchData}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Users</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Total Scans</th>
                    <th className="p-4">High Risk Scans</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-900/50 transition-all">
                      <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                        <div className={`p-2 rounded-xl text-xs font-bold ${usr.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'}`}>
                          {usr.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{usr.name}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">{usr.id}</span>
                        </div>
                      </td>

                      <td className="p-4 text-cyan-400">{usr.email}</td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${usr.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4 font-bold">{usr.totalScans} scans</td>

                      <td className="p-4">
                        {usr.dangerousScans > 0 ? (
                          <span className="text-rose-400 font-bold">{usr.dangerousScans} dangerous</span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleRole(usr.id, usr.role)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-semibold border transition-all ${
                            usr.role === 'admin'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {usr.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All Master Scan Logs */}
      {activeTab === 'scans' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={scanSearch}
                onChange={(e) => setScanSearch(e.target.value)}
                placeholder="Search scans by title, category, or user email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Displaying {filteredReports.length} of {reports.length} master system reports
            </span>
          </div>

          <div className="space-y-3">
            {filteredReports.map((rpt) => (
              <div
                key={rpt.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] uppercase font-bold">
                      {rpt.scanType}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{rpt.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      rpt.riskLevel === 'DANGEROUS' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {rpt.riskLevel} ({rpt.riskScore}% Threat)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      User: <strong>{rpt.userEmail || 'Guest'}</strong>
                    </span>
                    <button
                      onClick={() => handleDeleteReport(rpt.id)}
                      title="Permanently remove from database"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{rpt.summary}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Category: {rpt.threatCategory}</span>
                  <span>Scanned: {new Date(rpt.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Contact Inquiries */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100">{c.subject}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-cyan-400 font-mono">
                  From: {c.name} ({c.email})
                </div>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  "{c.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Isolated Storage Health
            </h3>
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Database Driver:</span>
                <span className="text-amber-400 font-bold">JSON Persistent Store (`/data/*.json`)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Total Registered Users:</span>
                <span className="text-slate-100 font-bold">{users.length} accounts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Master Scan Database Records:</span>
                <span className="text-cyan-400 font-bold">{reports.length} reports</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              AI Detector Service Health
            </h3>
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Gemini 3.6 Flash Engine:</span>
                <span className="text-emerald-400 font-bold">ACTIVE & OPERATIONAL</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Data Isolation Mode:</span>
                <span className="text-cyan-400 font-bold">STRICT USER ID ENFORCED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

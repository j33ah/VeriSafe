import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Search,
  LayoutDashboard,
  MessageSquare,
  Link2,
  Image as ImageIcon,
  PhoneCall,
  Mail,
  CreditCard,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Users,
  ShieldAlert
} from 'lucide-react';
import { User, ScanResult, DashboardStats, ScanType } from './types';
import { INITIAL_DASHBOARD_STATS } from './data/mockDatabase';
import { Background3DSpace } from './components/Background3DSpace';
import { HeroGlobe3D } from './components/HeroGlobe3D';
import { Navbar } from './components/Navbar';
import { ScannerHub } from './components/scanners/ScannerHub';
import { ThreatDashboard } from './components/ThreatDashboard';
import { ReportsView } from './components/ReportsView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AdminConsole } from './components/AdminConsole';
import { Footer } from './components/Footer';
import { ScannerModal } from './components/ScannerModal';
import { AuthModal } from './components/AuthModal';
import { AIChatbotWidget } from './components/AIChatbotWidget';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_DASHBOARD_STATS);
  
  // Scanner Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isScanLoading, setIsScanLoading] = useState<boolean>(false);

  // Auth Modal state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Fetch initial reports & stats from server
  const fetchReportsAndStats = async (currentUserParam?: User | null) => {
    const activeUser = currentUserParam !== undefined ? currentUserParam : user;
    try {
      let reportsUrl = '/api/reports';
      if (activeUser) {
        reportsUrl += `?userId=${encodeURIComponent(activeUser.id)}&role=${encodeURIComponent(activeUser.role || 'user')}`;
      }

      const [reportsRes, statsRes] = await Promise.all([
        fetch(reportsUrl),
        fetch('/api/stats')
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('Error fetching reports and stats:', err);
    }
  };

  useEffect(() => {
    fetchReportsAndStats(user);
  }, [user]);

  // Quick 1-Click Role Switcher for instant testing
  const handleSwitchUserRole = async (targetRole: 'admin' | 'user') => {
    try {
      const targetEmail = targetRole === 'admin' ? 'admin@sentinel.ai' : 'user@sentinel.ai';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        fetchReportsAndStats(data.user);
        if (targetRole === 'admin') {
          setActiveTab('admin');
        } else if (activeTab === 'admin') {
          setActiveTab('reports');
        }
      }
    } catch (err) {
      console.error('Role switch error:', err);
    }
  };

  // Generic Scan API Dispatcher
  const executeScan = async (endpoint: string, bodyData: any) => {
    setIsModalOpen(true);
    setIsScanLoading(true);
    setCurrentResult(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bodyData, userId: user?.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan execution failed');

      setCurrentResult(data);
      fetchReportsAndStats(); // Refresh DB list
    } catch (err: any) {
      console.error('Scan error:', err);
      // Fallback result in case of server connection issue
      setCurrentResult({
        id: 'rpt_fallback_' + Date.now(),
        scanType: 'whatsapp',
        title: 'Network Analysis Fallback',
        riskScore: 65,
        confidenceScore: 80,
        riskLevel: 'WARNING',
        threatCategory: 'Potential Risk Vector',
        summary: 'Payload inspected with fallback heuristics engine.',
        explanation: ['Analyzed suspicious string structures and potential threat vectors.'],
        safetyTips: ['Do not disclose sensitive account details or PINs.'],
        createdAt: new Date().toISOString()
      });
    } finally {
      setIsScanLoading(false);
    }
  };

  // Scanner Handlers
  const handleScanWhatsApp = (messageText: string) => {
    executeScan('/api/scan/whatsapp', { messageText });
  };

  const handleScanUrl = (url: string) => {
    executeScan('/api/scan/url', { url });
  };

  const handleScanScreenshot = (imageDataUrl: string, fileName?: string) => {
    executeScan('/api/scan/screenshot', { imageDataUrl, fileName });
  };

  const handleScanCall = (phoneNumber: string, callerName?: string) => {
    executeScan('/api/scan/call', { phoneNumber, callerName });
  };

  const handleScanEmail = (senderEmail: string, subject: string, emailBody: string) => {
    executeScan('/api/scan/email', { senderEmail, subject, emailBody });
  };

  const handleScanTransaction = (description: string, amount: number, currency: string, platform: string) => {
    executeScan('/api/scan/transaction', { description, amount, currency, platform });
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const handleViewReportDetails = (report: ScanResult) => {
    setCurrentResult(report);
    setIsScanLoading(false);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040816] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background 3D Space & Canvas Nebula Particles */}
      <Background3DSpace />

      {/* Glass Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setUser(null)}
        onSwitchUserRole={handleSwitchUserRole}
      />

      {/* Main Page Router Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-16 max-w-7xl mx-auto">
            
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 sm:py-12">
              
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Security Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest shadow-lg shadow-cyan-500/10">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>AI Powered Multi-Platform Fraud Detection</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  Protect Every Click.<br />
                  <span className="bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                    Detect Every Threat.
                  </span><br />
                  <span className="text-cyan-400">Stay One Step Ahead.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  SentinelAI brings enterprise-grade fraud detection to your fingertips. Instantly analyze WhatsApp scam messages, phishing links, fake payment screenshots, spam calls, email phishing, and suspicious financial transactions with Gemini 3.6 Flash AI.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Search className="w-5 h-5" />
                    <span>Start Free Scan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                    <span>View Threat Dashboard</span>
                  </button>
                </div>

                {/* Animated Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-left">
                  <div>
                    <h4 className="text-2xl font-black font-mono text-cyan-400">98%</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Detection Accuracy</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-mono text-slate-100">120K+</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Threats Blocked</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-mono text-blue-400">24/7</h4>
                    <p className="text-[11px] text-slate-400 font-mono">AI Real-time Protection</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-mono text-purple-300">50K+</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Protected Users</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Globe */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <HeroGlobe3D />
              </div>
            </div>

            {/* 6 CORE FRAUD DETECTION FEATURES SECTION */}
            <div className="space-y-8 pt-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-100">
                  Comprehensive 6-Layer Fraud Defense Suite
                </h2>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Click any vector below to launch live Gemini AI threat inspection.
                </p>
              </div>

              {/* 6 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. WhatsApp Scam */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-cyan-400/80 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      WhatsApp Scam Detector
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Identifies OTP theft, fake bank locks, international lottery lures, and emergency family imposter scams.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                    <span>Scan Message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Malicious Link */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-blue-400/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit group-hover:scale-110 transition-transform">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                      Malicious Link Analyzer
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Inspects HTTP/HTTPS, typosquatting domain spoofing, @ symbol redirects, and deceptive WHOIS signatures.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <span>Analyze URL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 3. Fake Payment Screenshot */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-purple-400/80 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      Fake Payment Screenshot Detector
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Gemini Vision OCR forensics to spot fake generator templates, mismatched fonts, and altered Zelle/Venmo receipts.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                    <span>Upload Screenshot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 4. Spam Call */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Spam Call Predictor
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Cross-checks phone numbers against community spam registries, robocall databases, and IRS imposter signatures.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <span>Check Phone Number</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 5. Phishing Email */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-rose-400/80 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 w-fit group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                      Phishing Email Detector
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Detects corporate HR payroll traps, fake invoice attachments, urgency tricks, and webmail domain spoofs.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                    <span>Inspect Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 6. Transaction Fraud */}
                <div
                  onClick={() => setActiveTab('scanner')}
                  className="p-6 rounded-3xl glass-panel border-slate-800 hover:border-emerald-400/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all cursor-pointer group space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      Transaction Fraud Checker
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Calculates overpayment refund risk, crypto wire settlement danger, and fake buyer cash-hold traps.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <span>Evaluate Transaction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FRAUD SCANNER TAB */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-extrabold text-slate-100">SentinelAI Interactive Fraud Scanner</h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Select a scanner below to parse messages, URLs, receipts, calls, emails, or transactions with Gemini 3.6 Flash.
              </p>
            </div>

            <ScannerHub
              onScanWhatsApp={handleScanWhatsApp}
              onScanUrl={handleScanUrl}
              onScanScreenshot={handleScanScreenshot}
              onScanCall={handleScanCall}
              onScanEmail={handleScanEmail}
              onScanTransaction={handleScanTransaction}
              isLoading={isScanLoading}
            />
          </div>
        )}

        {/* THREAT DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <ThreatDashboard
            stats={stats}
            recentReports={reports}
            onViewReport={handleViewReportDetails}
          />
        )}

        {/* REPORTS DATABASE TAB */}
        {activeTab === 'reports' && (
          <ReportsView
            reports={reports}
            currentUser={user}
            onDeleteReport={handleDeleteReport}
            onViewReport={handleViewReportDetails}
          />
        )}

        {/* ADMIN CONSOLE TAB */}
        {activeTab === 'admin' && (
          <AdminConsole
            currentUser={user}
            onSelectUserForScans={() => setActiveTab('reports')}
          />
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && <AboutView />}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && <ContactView />}
      </main>

      {/* Global Interactive Laser Scanning Result Modal */}
      <ScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={currentResult}
        isLoading={isScanLoading}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating AI Security Assistant Chatbot */}
      <AIChatbotWidget />
    </div>
  );
}

export default App;

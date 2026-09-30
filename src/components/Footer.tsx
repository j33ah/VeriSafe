import React from 'react';
import { Shield, Lock, Activity, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#030612]/90 backdrop-blur-xl py-12 px-4 relative z-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-wider text-slate-100">
              VeriSafe<span className="text-cyan-400">-AI</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Multi-Platform AI Fraud Detection System. Protecting users against WhatsApp scams, phishing links, fake payment screenshots, spam calls, and financial fraud.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VeriSafe-AI Defense System Online</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase font-mono text-slate-200 text-xs tracking-wider">Detection Tools</h5>
          <ul className="space-y-2">
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">WhatsApp Scam Detector</button></li>
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">Malicious Link Analyzer</button></li>
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">Fake Receipt Screenshot OCR</button></li>
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">Spam Call & Vishing Predictor</button></li>
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">Phishing Email Detector</button></li>
            <li><button onClick={() => setActiveTab('scanner')} className="hover:text-cyan-400 transition-colors">Transaction Fraud Checker</button></li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase font-mono text-slate-200 text-xs tracking-wider">Platform</h5>
          <ul className="space-y-2">
            <li><button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">Home Landing</button></li>
            <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">Threat Analytics Dashboard</button></li>
            <li><button onClick={() => setActiveTab('reports')} className="hover:text-cyan-400 transition-colors">Database Reports</button></li>
            <li><button onClick={() => setActiveTab('about')} className="hover:text-cyan-400 transition-colors">Threat Architecture</button></li>
            <li><button onClick={() => setActiveTab('contact')} className="hover:text-cyan-400 transition-colors">Security Team Contact</button></li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <h5 className="font-bold uppercase font-mono text-slate-200 text-xs tracking-wider">Engine Stack</h5>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">Gemini 3.6 Flash</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">Express Node</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">SQLite Database</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">React 19</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">Tailwind CSS 4</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-300">Recharts</span>
          </div>
          <p className="text-[10px] text-slate-500 pt-2">
            © 2026 Jeeah Mir. All rights reserved. VeriSafe-AI — Protect Every Click. Detect Every Threat.
          </p>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Shield, Cpu, Lock, CheckCircle2, Zap, Globe, Eye } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6">
      
      {/* Title Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Cyber Security Threat Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Next-Generation Fraud Prevention Powered by <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Gemini AI</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          VeriSafe-AI is designed to safeguard individuals, financial institutions, and digital platforms from modern AI-synthesized scams, phishing portals, forged receipt generator templates, and voice phishing attacks.
        </p>
      </div>

      {/* 4 Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Multi-Modal Gemini 3.6 Flash Engine</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Combines deep contextual NLP language modeling with computer vision OCR to detect subtle font misalignments, prompt injections, and deceptive domain structures.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border-blue-500/20 space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit">
            <Eye className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">6 Specialized Fraud Detection Vectors</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dedicated analyzers for WhatsApp direct messaging, phishing URLs, fake payment screenshots, spam call registries, header spoofed emails, and peer-to-peer transaction risks.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border-purple-500/20 space-y-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Zero-Trust & Data Confidentiality</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All threat payloads are parsed in isolated server environments with strict encryption. User data is never stored without explicit user session approval.
          </p>
        </div>
      </div>

      {/* How It Works Diagram Steps */}
      <div className="p-8 rounded-3xl glass-panel border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-100 font-mono text-center">
          VeriSafe-AI Real-Time Threat Scanning Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2">01</span>
            <h5 className="text-xs font-bold text-slate-200 mb-1">Payload Ingestion</h5>
            <p className="text-[11px] text-slate-400">User inputs suspicious message, link, image, or transaction.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 text-blue-300 font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2">02</span>
            <h5 className="text-xs font-bold text-slate-200 mb-1">Feature Extraction</h5>
            <p className="text-[11px] text-slate-400">Normalizes URLs, extracts text via OCR, checks domain TLDs & SPF.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2">03</span>
            <h5 className="text-xs font-bold text-slate-200 mb-1">Gemini AI Model</h5>
            <p className="text-[11px] text-slate-400">Evaluates coercion urgency, fake generator templates, & vishing score.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2">04</span>
            <h5 className="text-xs font-bold text-slate-200 mb-1">Defense Output</h5>
            <p className="text-[11px] text-slate-400">Outputs 0-100 Risk Rating, explanation, & actionable safety protocols.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';
import { ScanResult } from '../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScanResult | null;
  isLoading: boolean;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading
}) => {
  const [scanStep, setScanStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const steps = [
    'Parsing payload & normalizing input strings...',
    'Extracting entity vectors & deep neural features...',
    'Cross-referencing global threat intelligence databases...',
    'Evaluating risk score with Gemini AI 3.6 Flash...',
    'Generating defense report & safety tips...'
  ];

  useEffect(() => {
    if (isLoading) {
      setScanStep(0);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          const next = prev + Math.floor(Math.random() * 15 + 10);
          if (next > 20 && scanStep < 1) setScanStep(1);
          if (next > 45 && scanStep < 2) setScanStep(2);
          if (next > 70 && scanStep < 3) setScanStep(3);
          if (next > 85 && scanStep < 4) setScanStep(4);
          return Math.min(95, next);
        });
      }, 350);

      return () => clearInterval(interval);
    } else if (result) {
      setProgress(100);
      setScanStep(4);
    }
  }, [isLoading, result]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">SentinelAI Threat Analyzer</h3>
              <p className="text-xs text-slate-400 font-mono">Live AI Laser Security Inspection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              
              {/* Animated Laser Scanning Radar Circle */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-blue-500/30" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin" style={{ animationDuration: '6s' }} />
                
                {/* Center Pulse */}
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  <span className="text-xl font-extrabold font-mono text-cyan-300">{progress}%</span>
                </div>

                {/* Sweeping Laser Line Effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="w-full h-1/2 bg-gradient-to-b from-cyan-400/30 to-transparent transform origin-bottom animate-spin" style={{ animationDuration: '2s' }} />
                </div>
              </div>

              {/* Progress Step Logs */}
              <div className="w-full max-w-md space-y-2 text-left">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {steps[scanStep]}
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Risk Level Badge & Score Meter */}
              <div className={`p-5 rounded-2xl border ${
                result.riskLevel === 'DANGEROUS'
                  ? 'bg-red-950/40 border-red-500/50 text-red-200'
                  : result.riskLevel === 'WARNING'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.riskLevel === 'DANGEROUS' ? (
                      <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce" />
                    ) : result.riskLevel === 'WARNING' ? (
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    )}
                    <div>
                      <span className="text-xs uppercase tracking-widest font-mono text-slate-400">Threat Status</span>
                      <h4 className="text-xl font-black tracking-wide">{result.riskLevel} - {result.threatCategory}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono">{result.riskScore}%</span>
                    <p className="text-[10px] text-slate-400">Risk Score</p>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-900/80 rounded-full h-2.5 mt-4 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.riskLevel === 'DANGEROUS'
                        ? 'bg-red-500 shadow-[0_0_10px_#EF4444]'
                        : result.riskLevel === 'WARNING'
                        ? 'bg-amber-500 shadow-[0_0_10px_#F59E0B]'
                        : 'bg-emerald-500 shadow-[0_0_10px_#10B981]'
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">Summary Assessment</h5>
                <p className="text-sm text-slate-200 leading-relaxed">{result.summary}</p>
              </div>

              {/* Key Threat Explanation */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  Detailed AI Inspection Findings
                </h5>
                <ul className="space-y-2">
                  {result.explanation.map((item, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Safety Advice */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Recommended Action & Safety Protocols
                </h5>
                <ul className="space-y-2">
                  {result.safetyTips.map((tip, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Report stored in database • ID: {result?.id || 'Pending'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

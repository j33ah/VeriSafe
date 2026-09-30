import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Sparkles, UserX } from 'lucide-react';
import { SAMPLE_CALLS } from '../../data/mockDatabase';

interface CallScannerProps {
  onScan: (phone: string, callerName?: string) => void;
  isLoading: boolean;
}

export const CallScanner: React.FC<CallScannerProps> = ({ onScan, isLoading }) => {
  const [phone, setPhone] = useState<string>('');
  const [callerName, setCallerName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    onScan(phone, callerName);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Spam Call Predictor</h3>
          <p className="text-xs text-slate-400">
            Cross-references phone numbers against global spam blacklists, caller ID spoofs, and AI vishing patterns.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 font-mono uppercase">
                Phone Number
              </label>
              <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                🇮🇳 Default: +91 (India)
              </span>
            </div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
              Caller ID / Organization (Optional)
            </label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. CBI Officer / SBI Security"
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
          </div>
        </div>

        {/* Sample Numbers */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Try Sample Call Inputs:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CALLS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhone(s.phone);
                  setCallerName(s.callerName || '');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !phone.trim()}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <UserX className="w-5 h-5" />
          <span>{isLoading ? 'Searching Spam Registry...' : 'Predict Call Risk'}</span>
        </button>
      </form>
    </div>
  );
};

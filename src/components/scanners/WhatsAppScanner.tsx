import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { SAMPLE_WHATSAPP_SCAMS } from '../../data/mockDatabase';

interface WhatsAppScannerProps {
  onScan: (text: string) => void;
  isLoading: boolean;
}

export const WhatsAppScanner: React.FC<WhatsAppScannerProps> = ({ onScan, isLoading }) => {
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onScan(text);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">WhatsApp Scam Detector</h3>
          <p className="text-xs text-slate-400">
            Detects OTP theft, fake bank alerts, lottery claims, urgent family emergencies, and gift card scams.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
            Message Content / Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste suspicious WhatsApp or SMS message here..."
            rows={5}
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />
        </div>

        {/* Sample One-Click Test Prompts */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Try Sample Scam Messages:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_WHATSAPP_SCAMS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(s.text)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{isLoading ? 'Scanning Payload...' : 'Analyze Message Now'}</span>
        </button>
      </form>
    </div>
  );
};

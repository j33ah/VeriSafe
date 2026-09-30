import React, { useState } from 'react';
import { Mail, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { SAMPLE_EMAILS } from '../../data/mockDatabase';

interface EmailScannerProps {
  onScan: (sender: string, subject: string, body: string) => void;
  isLoading: boolean;
}

export const EmailScanner: React.FC<EmailScannerProps> = ({ onScan, isLoading }) => {
  const [sender, setSender] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !body.trim()) return;
    onScan(sender, subject, body);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Phishing Email Detector</h3>
          <p className="text-xs text-slate-400">
            Analyzes sender headers, fake domain spoofing, urgency traps, credential harvesting, and malicious attachments.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
              Sender Email Address
            </label>
            <input
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. hr-update@company-payroll-portal.net"
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. ACTION REQUIRED: Direct Deposit Update"
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
            Email Body Text
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste complete email message body..."
            rows={5}
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 transition-all"
          />
        </div>

        {/* Sample Emails */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Try Sample Email Inputs:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_EMAILS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSender(s.sender);
                  setSubject(s.subject);
                  setBody(s.body);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-xs text-slate-300 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !sender.trim() || !body.trim()}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{isLoading ? 'Scanning Email Headers...' : 'Analyze Phishing Risk'}</span>
        </button>
      </form>
    </div>
  );
};

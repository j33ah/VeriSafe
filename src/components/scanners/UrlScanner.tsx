import React, { useState } from 'react';
import { Link2, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { SAMPLE_URLS } from '../../data/mockDatabase';

interface UrlScannerProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <Link2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Malicious Link Analyzer</h3>
          <p className="text-xs text-slate-400">
            Checks SSL certificates, typosquatting brand spoofing, hidden @ redirects, and deceptive domain TLDs.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
            Website URL or Link
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. http://chase-security-update.xyz/verify"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Sample URLs */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Try Sample Links:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(s.url)}
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
          disabled={isLoading || !url.trim()}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 hover:from-blue-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{isLoading ? 'Inspecting Domain...' : 'Analyze URL Safety'}</span>
        </button>
      </form>
    </div>
  );
};

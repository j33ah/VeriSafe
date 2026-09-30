import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, User, MessageSquare } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('Report Threat Vector');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');

      setSuccess(data.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error submitting message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-12 h-12 mx-auto flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">
          Contact VeriSafe-AI Security Intelligence Response Team
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Have a novel scam campaign or enterprise security query? Send a report directly to our cybersecurity research analysts.
        </p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
        
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">Your Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">Inquiry Category</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="Report Threat Vector">Report New Scam / Threat Vector</option>
              <option value="Enterprise API Access">Enterprise Fraud Detection API Query</option>
              <option value="Security Research Vulnerability">Security Research Vulnerability Disclosure</option>
              <option value="General Question">General Platform Question</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">Message / Threat Details</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the threat campaign or your inquiry..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Transmitting Message...' : 'Submit Security Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

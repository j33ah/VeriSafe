import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl glass-panel border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] p-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 w-12 h-12 mx-auto flex items-center justify-center text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-100 tracking-tight">
            {mode === 'login' ? 'Welcome Back to SentinelAI' : 'Create SentinelAI Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access your saved fraud threat reports & personalized security dashboard.'
              : 'Join over 50,000 protected users against AI fraud and scams.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 mb-4">
            {error}
          </div>
        )}

        {/* Quick Demo Credentials Switcher */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
            ⚡ Quick Demo Sign-In (Select Role & Separate Data):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'admin@sentinel.ai' })
                  });
                  const data = await res.json();
                  onSuccess(data.user);
                  onClose();
                } catch (e) {} finally {
                  setLoading(false);
                }
              }}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>🛡️ Admin Account</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">ADMIN</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'user@sentinel.ai' })
                  });
                  const data = await res.json();
                  onSuccess(data.user);
                  onClose();
                } catch (e) {} finally {
                  setLoading(false);
                }
              }}
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>👤 Standard User</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">USER</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1 uppercase">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="security@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Dashboard' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-cyan-400 hover:underline font-semibold">
                Sign Up Free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-400 hover:underline font-semibold">
                Login Here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

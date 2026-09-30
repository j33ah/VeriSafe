import React, { useState } from 'react';
import { ShieldAlert, Sparkles, CreditCard, Coins } from 'lucide-react';

interface TransactionScannerProps {
  onScan: (description: string, amount: number, currency: string, platform: any) => void;
  isLoading: boolean;
}

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: '₹ INR (Indian Rupee)' },
  { code: 'USD', symbol: '$', label: '$ USD (US Dollar)' },
  { code: 'EUR', symbol: '€', label: '€ EUR (Euro)' },
  { code: 'GBP', symbol: '£', label: '£ GBP (British Pound)' },
  { code: 'AED', symbol: 'د.إ', label: 'د.إ AED (UAE Dirham)' },
  { code: 'CAD', symbol: 'C$', label: 'C$ CAD (Canadian Dollar)' },
  { code: 'AUD', symbol: 'A$', label: 'A$ AUD (Australian Dollar)' },
];

export const TransactionScanner: React.FC<TransactionScannerProps> = ({ onScan, isLoading }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('5000');
  const [currency, setCurrency] = useState<string>('INR');
  const [platform, setPlatform] = useState<string>('UPI / Paytm / GPay');

  const platforms = [
    'UPI / Paytm / GPay / PhonePe',
    'Bank Transfer (IMPS / NEFT / Wire)',
    'Zelle',
    'Venmo',
    'PayPal',
    'Crypto (USDT / BTC)',
    'Other'
  ];

  const currentCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onScan(description, Number(amount), currentCurrencyObj.symbol, platform);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Multi-Currency Transaction Fraud Checker</h3>
          <p className="text-xs text-slate-400">
            Evaluates financial transfer risks across multi-currency channels (₹ INR, $ USD, € EUR, £ GBP), UPI QR scams, and non-reversible portals.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-semibold"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
              Transfer Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-semibold"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
              Amount ({currentCurrencyObj.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-bold font-mono text-base">
                {currentCurrencyObj.symbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 font-mono mb-2 uppercase">
            Description / Transaction Context
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Buyer sent QR code claiming 'Scan to Receive ₹25,000 payment into your Google Pay account'..."
            rows={4}
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Try Sample Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrency('INR');
                setPlatform('UPI / Paytm / GPay / PhonePe');
                setAmount('25000');
                setDescription('OLX buyer claims to scan QR code to RECEIVE money into Google Pay / PhonePe account.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>UPI QR Code Receive Scam (₹25,000)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('INR');
                setPlatform('Bank Transfer (IMPS / NEFT / Wire)');
                setAmount('150000');
                setDescription('Telegram online product rating task requiring advance deposit to unlock wallet withdrawal.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Telegram Task Deposit Scam (₹1,50,000)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('USD');
                setPlatform('Crypto (USDT / BTC)');
                setAmount('2500');
                setDescription('Seller demands USDT crypto transfer before releasing vehicle registration keys.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Crypto Vehicle Hold ($2,500)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('EUR');
                setPlatform('Wire Transfer');
                setAmount('1200');
                setDescription('Buyer claims overpayment via EU Bank Wire and requests immediate partial refund.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>EU Wire Overpayment (€1,200)</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{isLoading ? 'Calculating Probability...' : 'Analyze Financial Fraud Risk'}</span>
        </button>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { MessageSquare, Link2, Image as ImageIcon, PhoneCall, Mail, CreditCard, ShieldCheck } from 'lucide-react';
import { ScanType } from '../../types';
import { WhatsAppScanner } from './WhatsAppScanner';
import { UrlScanner } from './UrlScanner';
import { ScreenshotScanner } from './ScreenshotScanner';
import { CallScanner } from './CallScanner';
import { EmailScanner } from './EmailScanner';
import { TransactionScanner } from './TransactionScanner';

interface ScannerHubProps {
  onScanWhatsApp: (text: string) => void;
  onScanUrl: (url: string) => void;
  onScanScreenshot: (imageDataUrl: string, fileName?: string) => void;
  onScanCall: (phone: string, callerName?: string) => void;
  onScanEmail: (sender: string, subject: string, body: string) => void;
  onScanTransaction: (description: string, amount: number, currency: string, platform: any) => void;
  isLoading: boolean;
  initialType?: ScanType;
}

export const ScannerHub: React.FC<ScannerHubProps> = ({
  onScanWhatsApp,
  onScanUrl,
  onScanScreenshot,
  onScanCall,
  onScanEmail,
  onScanTransaction,
  isLoading,
  initialType = 'whatsapp'
}) => {
  const [activeScanner, setActiveScanner] = useState<ScanType>(initialType);

  const tools = [
    { id: 'whatsapp', label: 'WhatsApp Scam', icon: MessageSquare, desc: 'Messages & OTP Fraud', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400' },
    { id: 'url', label: 'Malicious Link', icon: Link2, desc: 'Phishing URLs & Spoofs', color: 'from-blue-500/20 to-indigo-500/20 text-blue-400' },
    { id: 'screenshot', label: 'Fake Payment', icon: ImageIcon, desc: 'Receipt Forensics & OCR', color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
    { id: 'call', label: 'Spam Call', icon: PhoneCall, desc: 'Vishing & Robocalls', color: 'from-amber-500/20 to-orange-500/20 text-amber-400' },
    { id: 'email', label: 'Phishing Email', icon: Mail, desc: 'Header Spoofing & BEC', color: 'from-rose-500/20 to-pink-500/20 text-rose-400' },
    { id: 'transaction', label: 'Transaction Fraud', icon: CreditCard, desc: 'P2P Transfer Risk', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Tool Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeScanner === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveScanner(t.id as ScanType)}
              className={`p-4 rounded-2xl transition-all duration-300 text-left border flex flex-col justify-between group relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.25)] scale-[1.02]'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${t.color} border border-slate-700/50 w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {t.label}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{t.desc}</p>
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Scanner Input Panel */}
      <div className="relative">
        {activeScanner === 'whatsapp' && (
          <WhatsAppScanner onScan={onScanWhatsApp} isLoading={isLoading} />
        )}
        {activeScanner === 'url' && (
          <UrlScanner onScan={onScanUrl} isLoading={isLoading} />
        )}
        {activeScanner === 'screenshot' && (
          <ScreenshotScanner onScan={onScanScreenshot} isLoading={isLoading} />
        )}
        {activeScanner === 'call' && (
          <CallScanner onScan={onScanCall} isLoading={isLoading} />
        )}
        {activeScanner === 'email' && (
          <EmailScanner onScan={onScanEmail} isLoading={isLoading} />
        )}
        {activeScanner === 'transaction' && (
          <TransactionScanner onScan={onScanTransaction} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

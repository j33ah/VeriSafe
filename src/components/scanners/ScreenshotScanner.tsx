import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, ShieldAlert, Sparkles, FileText, CheckCircle } from 'lucide-react';

interface ScreenshotScannerProps {
  onScan: (imageDataUrl: string, fileName?: string) => void;
  isLoading: boolean;
}

export const ScreenshotScanner: React.FC<ScreenshotScannerProps> = ({ onScan, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate synthetic mock receipt canvas image for quick 1-click sample test
  const handleSampleReceipt = (type: 'fake' | 'genuine') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark canvas background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 400, 500);

    // Header bar
    ctx.fillStyle = type === 'fake' ? '#7C3AED' : '#059669';
    ctx.fillRect(0, 0, 400, 70);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(type === 'fake' ? 'Zelle Transfer Sent' : 'PayPal Payment Sent', 20, 42);

    ctx.font = '28px sans-serif';
    ctx.fillText(type === 'fake' ? '$1,450.00' : '$85.00', 20, 130);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Recipient: Alex Rivera (alex@market.com)', 20, 170);
    ctx.fillText('Date: Jul 28, 2026, 10:14 AM', 20, 200);

    if (type === 'fake') {
      // Inconsistent font alignment for fake edit simulation
      ctx.font = 'italic 16px Courier New';
      ctx.fillStyle = '#F43F5E';
      ctx.fillText('REF ID: #ZEL-990812-FAKE-EDIT', 20, 250);
      ctx.fillText('Status: Pending Bank Hold Authorization', 20, 280);
    } else {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#34D399';
      ctx.fillText('Transaction ID: 88A9102931201', 20, 250);
      ctx.fillText('Status: Completed & Cleared', 20, 280);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);
    setFileName(type === 'fake' ? 'Suspicious_Zelle_Receipt.png' : 'Genuine_Paypal_Receipt.png');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;
    onScan(imagePreview, fileName);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel border-cyan-500/20 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Fake Payment Screenshot Detector</h3>
          <p className="text-xs text-slate-400">
            Multimodal OCR and AI vision analysis to detect edited fonts, fake payment generators, and tampered bank receipts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Payment Receipt Preview"
                className="max-h-48 mx-auto rounded-xl border border-purple-500/30 shadow-lg"
              />
              <p className="text-xs font-mono text-purple-300">{fileName || 'Screenshot Loaded'}</p>
              <p className="text-[10px] text-slate-400">Click to swap image</p>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/30 w-16 h-16 mx-auto flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Click or drag payment screenshot here
                </p>
                <p className="text-xs text-slate-400">Supports Zelle, Venmo, PayPal, CashApp, Bank Transfers (PNG, JPG)</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">Generate Sample Receipts:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSampleReceipt('fake')}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-rose-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Fake Zelle Receipt ($1,450)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSampleReceipt('genuine')}
              className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-emerald-300 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Genuine PayPal Receipt ($85)</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !imagePreview}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-slate-950 bg-gradient-to-r from-purple-400 via-indigo-500 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{isLoading ? 'Running Gemini Vision OCR...' : 'Analyze Screenshot Forensics'}</span>
        </button>
      </form>
    </div>
  );
};

export type ScanType = 
  | 'whatsapp'
  | 'url'
  | 'screenshot'
  | 'call'
  | 'email'
  | 'transaction';

export type RiskLevel = 'SAFE' | 'WARNING' | 'DANGEROUS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ScanResult {
  id: string;
  userId?: string;
  scanType: ScanType;
  title: string;
  riskScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  riskLevel: RiskLevel;
  threatCategory: string; // e.g. "OTP Phishing", "Fake Domain Spoof", "Edited Payment Image"
  summary: string;
  explanation: string[];
  safetyTips: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DashboardStats {
  totalScans: number;
  todayThreats: number;
  blockedScams: number;
  detectionAccuracy: number;
  threatTypes: { name: string; count: number; color: string }[];
  riskDistribution: { level: string; count: number; fill: string }[];
  monthlyActivity: { month: string; whatsapp: number; url: number; screenshot: number; email: number; total: number }[];
}

export interface WhatsAppScanInput {
  messageText: string;
  senderNumber?: string;
}

export interface UrlScanInput {
  url: string;
}

export interface ScreenshotScanInput {
  imageDataUrl: string; // Base64 data URL or uploaded image URL
  fileName?: string;
}

export interface CallScanInput {
  phoneNumber: string;
  callerName?: string;
}

export interface EmailScanInput {
  senderEmail: string;
  subject: string;
  emailBody: string;
}

export interface TransactionScanInput {
  description: string;
  amount: number;
  currency?: string;
  platform: 'Zelle' | 'Venmo' | 'PayPal' | 'Wire Transfer' | 'Crypto' | 'Bank Transfer' | 'UPI / Paytm / GPay' | 'Other';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

import { ScanResult, DashboardStats } from '../types';

export const SAMPLE_WHATSAPP_SCAMS = [
  {
    title: "Urgent Bank Account Verification",
    text: "Dear customer, your Chase Bank account has been temporarily suspended due to unusual activity. Click here immediately to verify your identity or your account will be locked: http://chase-security-verify-login.cc/auth?id=9281. Do not share this OTP: 884-102."
  },
  {
    title: "International Lottery Winner",
    text: "Congratulations! You have been selected as the grand winner of $500,000 in the Whatsapp Global Anniversary Lottery! To claim your cash prize, send a processing fee of $250 via Apple Gift Card or Bitcoin to agent @lottery_admin_official."
  },
  {
    title: "Family Member Emergency Call for Help",
    text: "Mom it's me! I lost my phone and wallet on vacation and my phone battery is dying. I need you to send $800 right now to this Zelle account so I can pay the hotel bill. Please hurry don't call my old number!"
  }
];

export const SAMPLE_URLS = [
  {
    title: "Phishing Amazon Login",
    url: "http://amazon-account-security-update.app-online-check.xyz/login?ref=sec"
  },
  {
    title: "Fake Paypal Resolution Center",
    url: "https://paypaI-security-update-help.org/verify-account"
  },
  {
    title: "Legitimate Apple Website",
    url: "https://www.apple.com/support"
  }
];

export const SAMPLE_CALLS = [
  {
    title: "Fake Police / CBI Digital Arrest Call",
    phone: "+91 98765 43210",
    callerName: "CBI Cyber Crime Division"
  },
  {
    title: "SBI Bank KYC Account Suspension Scam",
    phone: "+91 1800 22 2244",
    callerName: "SBI Banking Security Dept"
  },
  {
    title: "Customs FedEx Illegal Package Fraud",
    phone: "+91 91234 56789",
    callerName: "Customs Clearance Officer"
  },
  {
    title: "Verified HDFC Official Care (Safe)",
    phone: "+91 1800 202 6161",
    callerName: "HDFC Bank Official Customer Care"
  }
];

export const SAMPLE_EMAILS = [
  {
    title: "Urgent HR Payroll Direct Deposit Change",
    sender: "hr-update@company-payroll-portal.net",
    subject: "ACTION REQUIRED: Update Direct Deposit Information Within 24 Hours",
    body: "Dear Employee, Our payroll system is undergoing mandatory security upgrades. Please log into the portal immediately to re-confirm your SSN, banking details, and current password. Failure to do so will delay your upcoming paycheck."
  },
  {
    title: "Fake Invoice Attached (PDF Phishing)",
    sender: "billing-department@geek-squad-renewals-service.com",
    subject: "Invoice #GS-99821 Paid - $499.99 Charged to Your Card",
    body: "Thank you for your order! Your auto-renewal for Geek Squad Security Protection ($499.99) has been processed. If you did not authorize this charge, call our helpline immediately at 1-888-555-0199 to request a full refund."
  }
];

export const INITIAL_DASHBOARD_STATS: DashboardStats = {
  totalScans: 14280,
  todayThreats: 142,
  blockedScams: 13950,
  detectionAccuracy: 98.4,
  threatTypes: [
    { name: 'WhatsApp Scams', count: 4210, color: '#22D3EE' },
    { name: 'Phishing Links', count: 3850, color: '#3B82F6' },
    { name: 'Fake Screenshots', count: 2190, color: '#7C3AED' },
    { name: 'Spam Calls', count: 1840, color: '#F59E0B' },
    { name: 'Email Phishing', count: 1520, color: '#EF4444' },
    { name: 'Transaction Fraud', count: 670, color: '#10B981' },
  ],
  riskDistribution: [
    { level: 'SAFE', count: 4850, fill: '#10B981' },
    { level: 'WARNING', count: 3120, fill: '#F59E0B' },
    { level: 'DANGEROUS', count: 6310, fill: '#EF4444' },
  ],
  monthlyActivity: [
    { month: 'Jan', whatsapp: 320, url: 290, screenshot: 180, email: 140, total: 930 },
    { month: 'Feb', whatsapp: 410, url: 340, screenshot: 210, email: 190, total: 1150 },
    { month: 'Mar', whatsapp: 520, url: 480, screenshot: 290, email: 230, total: 1520 },
    { month: 'Apr', whatsapp: 680, url: 590, screenshot: 380, email: 310, total: 1960 },
    { month: 'May', whatsapp: 890, url: 720, screenshot: 490, email: 410, total: 2510 },
    { month: 'Jun', whatsapp: 1120, url: 910, screenshot: 580, email: 490, total: 3100 },
  ]
};

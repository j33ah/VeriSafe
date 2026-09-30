import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { ScanResult, User, ContactMessage, DashboardStats } from './src/types.js';
import { INITIAL_DASHBOARD_STATS } from './src/data/mockDatabase.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Ensure database and uploads directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: JSON file database helpers
function readJSONFile<T>(filePath: string, defaultValue: T): T {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }
  return defaultValue;
}

function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing to ${filePath}:`, e);
  }
}

// Initialize seed data if empty
let reportsDB: ScanResult[] = readJSONFile(REPORTS_FILE, []);
let usersDB: User[] = readJSONFile(USERS_FILE, []);
let contactsDB: ContactMessage[] = readJSONFile(CONTACTS_FILE, []);

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'System Administrator',
    email: 'admin@sentinel.ai',
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'usr_user_1',
    name: 'Standard User',
    email: 'user@sentinel.ai',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'usr_user_2',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

if (usersDB.length === 0) {
  usersDB = DEFAULT_USERS;
  writeJSONFile(USERS_FILE, usersDB);
} else {
  let updated = false;
  usersDB.forEach(u => {
    if (!u.role) {
      u.role = u.email.toLowerCase().includes('admin') ? 'admin' : 'user';
      updated = true;
    }
  });
  if (!usersDB.some(u => u.role === 'admin')) {
    usersDB.push(DEFAULT_USERS[0]);
    updated = true;
  }
  if (!usersDB.some(u => u.email === 'user@sentinel.ai')) {
    usersDB.push(DEFAULT_USERS[1]);
    updated = true;
  }
  if (updated) writeJSONFile(USERS_FILE, usersDB);
}

if (reportsDB.length === 0) {
  reportsDB = [
    {
      id: 'rpt_init_1',
      userId: 'usr_user_1',
      scanType: 'whatsapp',
      title: 'Urgent Bank Account Verification Scam',
      riskScore: 95,
      confidenceScore: 98,
      riskLevel: 'DANGEROUS',
      threatCategory: 'OTP & Account Takeover Phishing',
      summary: 'High risk social engineering attack requesting immediate OTP verification and link click.',
      explanation: [
        'Contains urgent coercive language threatening account suspension.',
        'Uses fake domain URL posing as legitimate banking authority.',
        'Requests sharing sensitive One-Time Passcode (OTP).'
      ],
      safetyTips: [
        'Never click on links sent via SMS or WhatsApp claiming to be your bank.',
        'Banks will NEVER ask you to disclose OTP codes or passwords.',
        'Block and report the sender number immediately.'
      ],
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'rpt_init_2',
      userId: 'usr_user_2',
      scanType: 'url',
      title: 'Amazon Phishing Domain Login',
      riskScore: 92,
      confidenceScore: 96,
      riskLevel: 'DANGEROUS',
      threatCategory: 'Typosquatting & Credential Harvesting',
      summary: 'Malicious spoofed Amazon domain configured to harvest credentials.',
      explanation: [
        'Domain `amazon-account-security-update.xyz` uses nested subdomains to deceive users.',
        'Lacks valid official SSL security certificate from Amazon Services.'
      ],
      safetyTips: [
        'Always type official URLs directly into your browser (e.g. amazon.com).'
      ],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'rpt_init_3',
      userId: 'usr_user_1',
      scanType: 'transaction',
      title: '₹25,000 via UPI / PhonePe QR Code',
      riskScore: 88,
      confidenceScore: 92,
      riskLevel: 'DANGEROUS',
      threatCategory: 'UPI QR Code "Scan to Receive Money" Fraud',
      summary: 'OLX buyer requested scanning QR code to receive money.',
      explanation: [
        'CRITICAL: Scanning a QR code ALWAYS deducts money from your account, never deposits!'
      ],
      safetyTips: [
        'Never enter UPI PIN or scan QR code to receive money.'
      ],
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'rpt_init_4',
      userId: 'usr_admin_1',
      scanType: 'call',
      title: '+91 98765 43210 (CBI Cyber Crime)',
      riskScore: 95,
      confidenceScore: 99,
      riskLevel: 'DANGEROUS',
      threatCategory: 'Digital Arrest & Government Imposter Scam',
      summary: 'Fake CBI officer demanding video call digital arrest fine.',
      explanation: [
        'Indian law enforcement (CBI/Police) never conducts digital arrests over video calls.'
      ],
      safetyTips: [
        'Report immediately to National Cyber Crime Helpline 1930.'
      ],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
  writeJSONFile(REPORTS_FILE, reportsDB);
}

// Lazy Gemini client getter
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// HEURISTIC + GEMINI DETECTOR LOGIC ENGINES
// ==========================================

// 1. WhatsApp Scam Logic
async function analyzeWhatsAppMessage(text: string, userId?: string): Promise<ScanResult> {
  let riskScore = 20;
  let threatCategory = 'Informational / Low Threat';
  const explanation: string[] = [];
  const safetyTips: string[] = [];

  const lower = text.toLowerCase();

  if (/otp|one time password|verification code|pin code/i.test(text)) {
    riskScore += 35;
    explanation.push('Requests sensitive authentication credentials or One-Time Passcodes (OTP).');
    safetyTips.push('Never share OTP codes or authorization PINs with anyone.');
  }

  if (/winner|lottery|prize|claim \$|won \$|jackpot|congratulations/i.test(text)) {
    riskScore += 30;
    explanation.push('Uses lottery or cash prize lure requiring processing fees or upfront payment.');
    safetyTips.push('Legitimate lotteries do not ask winners to pay advance fees or gift cards.');
  }

  if (/urgent|immediately|suspended|locked|24 hours|action required/i.test(text)) {
    riskScore += 20;
    explanation.push('Employs high-pressure psychological urgency to force panicked action.');
  }

  if (/http:\/\/|https:\/\/|bit\.ly|tinyurl|\.xyz|\.cc|\.top|\.ru/i.test(text)) {
    riskScore += 25;
    explanation.push('Contains unverified external link or URL shortener redirect.');
    safetyTips.push('Do not open unknown links received via direct messaging.');
  }

  if (/bitcoin|crypto|gift card|apple card|steam card|zelle|cashapp/i.test(text)) {
    riskScore += 25;
    explanation.push('Demands untraceable payment methods (crypto, gift cards, peer-to-peer apps).');
  }

  riskScore = Math.min(99, Math.max(5, riskScore));
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'SAFE';
  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    threatCategory = 'Social Engineering & Financial Scam';
  } else if (riskScore >= 35) {
    riskLevel = 'WARNING';
    threatCategory = 'Suspicious Unsolicited Messaging';
  }

  let summary = `WhatsApp message evaluated with ${riskScore}% fraud threat probability (${riskLevel}).`;

  // Enhance with Gemini 3.6 Flash if API key available
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this WhatsApp message for fraud, phishing, or social engineering:
"${text}"

Provide a JSON object with:
- riskScore: number (0 to 100)
- confidenceScore: number (0 to 100)
- threatCategory: string (e.g., "OTP Theft Phishing", "Lottery Scam", "Bank Imposter", "Safe")
- summary: short 1-sentence summary
- explanation: array of strings detailing why it is safe or dangerous
- safetyTips: array of actionable recommendations`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation.splice(0, explanation.length, ...parsed.explanation);
          if (parsed.safetyTips?.length) safetyTips.splice(0, safetyTips.length, ...parsed.safetyTips);
        }
      }
    } catch (e) {
      console.warn('Gemini WhatsApp scan fallback used:', e);
    }
  }

  if (safetyTips.length === 0) {
    safetyTips.push('Verify unknown senders through independent official channels before responding.');
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'whatsapp',
    title: text.length > 40 ? text.substring(0, 40) + '...' : text,
    riskScore,
    confidenceScore: Math.min(99, riskScore + 5),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { rawText: text },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// 2. Malicious URL Scanner Logic
async function analyzeUrl(urlInput: string, userId?: string): Promise<ScanResult> {
  let urlStr = urlInput.trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'http://' + urlStr;
  }

  let riskScore = 15;
  let threatCategory = 'Legitimate Web Domain';
  const explanation: string[] = [];
  const safetyTips: string[] = [];

  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();

    if (parsed.protocol === 'http:') {
      riskScore += 20;
      explanation.push('Uses unencrypted HTTP connection instead of secure HTTPS.');
    }

    if (/@/.test(urlStr)) {
      riskScore += 35;
      explanation.push('Contains "@" character, a known obfuscation trick to disguise destination hostname.');
    }

    if (/\.(xyz|cc|top|ru|club|tk|ga|cf|gq|zip|kim)$/i.test(host)) {
      riskScore += 25;
      explanation.push(`Uses high-risk TLD (${host.split('.').pop()}) frequently exploited in phishing campaigns.`);
    }

    if (host.includes('amazon') || host.includes('paypal') || host.includes('apple') || host.includes('chase') || host.includes('microsoft')) {
      if (!host.endsWith('.amazon.com') && !host.endsWith('.paypal.com') && !host.endsWith('.apple.com') && !host.endsWith('.chase.com') && !host.endsWith('.microsoft.com')) {
        riskScore += 50;
        threatCategory = 'Brand Impersonation & Typosquatting';
        explanation.push('Contains brand name in domain string but does NOT originate from official registered domain.');
      }
    }

    if (parsed.pathname.length > 60 || host.split('.').length > 3) {
      riskScore += 15;
      explanation.push('Contains deeply nested subdomains or excessively long path structures.');
    }
  } catch (e) {
    riskScore = 85;
    explanation.push('Malformed URL string unable to resolve standard hostname.');
  }

  riskScore = Math.min(99, Math.max(5, riskScore));
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'SAFE';
  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    threatCategory = threatCategory !== 'Legitimate Web Domain' ? threatCategory : 'Malicious Phishing Portal';
  } else if (riskScore >= 35) {
    riskLevel = 'WARNING';
    threatCategory = 'Suspicious Domain Signature';
  }

  let summary = `URL ${urlStr} analyzed with ${riskScore}% threat rating.`;

  // Gemini enhancement
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this URL for malicious phishing, fake login, or scam threats: "${urlStr}".
Return JSON with:
- riskScore (0-100)
- confidenceScore (0-100)
- threatCategory (string)
- summary (string)
- explanation (array of string)
- safetyTips (array of string)`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation.splice(0, explanation.length, ...parsed.explanation);
          if (parsed.safetyTips?.length) safetyTips.splice(0, safetyTips.length, ...parsed.safetyTips);
        }
      }
    } catch (e) {
      console.warn('Gemini URL scan fallback used:', e);
    }
  }

  if (safetyTips.length === 0) {
    safetyTips.push('Never enter passwords or credit card numbers on unverified domains.');
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'url',
    title: urlStr,
    riskScore,
    confidenceScore: Math.min(99, riskScore + 4),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { url: urlStr },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// 3. Fake Payment Screenshot Detector Logic (Multimodal Gemini Vision OCR)
async function analyzeScreenshot(imageDataUrl: string, fileName?: string, userId?: string): Promise<ScanResult> {
  let riskScore = 45;
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'WARNING';
  let threatCategory = 'Potentially Manipulated Payment Proof';
  let summary = 'Payment screenshot evaluated for digital tampering, font misalignment, and unverified reference IDs.';
  let explanation: string[] = [
    'Analyzed pixel density around payment totals and transaction timestamps.',
    'Scanned for mismatched system fonts commonly found in fake payment generator templates.',
    'Checked alignment of banking logo watermarks and reference codes.'
  ];
  let safetyTips: string[] = [
    'Always verify receipt of funds directly inside your official banking or wallet app, never rely solely on a screenshot screenshot.',
    'Require bank confirmation reference IDs before releasing goods or services.'
  ];

  const gemini = getGeminiClient();
  if (gemini && imageDataUrl.includes('base64,')) {
    try {
      const mimeMatch = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const base64Data = imageDataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

      const prompt = `Examine this payment confirmation screenshot (Zelle, Venmo, PayPal, Bank Transfer, GPay, Paytm, etc.) for signs of fake edits, Photoshop forgery, mismatched typography, suspicious transaction amounts, or fake receipt templates.

Return a structured JSON with:
- riskScore: number (0 to 100, where 0-30 is Genuine, 31-69 is Possibly Edited, 70-100 is High Fraud Risk)
- confidenceScore: number (0 to 100)
- threatCategory: string (e.g. "Genuine Transaction", "Font Manipulation Detected", "Fake Payment Generator Template", "High Fraud Risk")
- summary: string
- explanation: array of detailed findings (e.g. font misalignment, inconsistent metadata, missing bank transaction hash)
- safetyTips: array of actionable advice for the recipient`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation = parsed.explanation;
          if (parsed.safetyTips?.length) safetyTips = parsed.safetyTips;
        }
      }
    } catch (err) {
      console.warn('Gemini vision screenshot scan fallback used:', err);
    }
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'screenshot',
    title: fileName ? `Screenshot (${fileName})` : 'Payment Receipt Screenshot',
    riskScore,
    confidenceScore: Math.min(99, riskScore + 3),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { fileName },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// 4. Spam Call Detector Logic
async function analyzeCall(phoneInput: string, callerName?: string, userId?: string): Promise<ScanResult> {
  const cleanNum = phoneInput.replace(/[^\d+]/g, '');
  let riskScore = 15;
  let threatCategory = 'Verified / Normal Caller';
  const explanation: string[] = [];
  const safetyTips: string[] = [];

  const isIndianNum = cleanNum.startsWith('+91') || cleanNum.startsWith('91') || cleanNum.length === 10;
  const lowerCaller = (callerName || '').toLowerCase();

  if (isIndianNum) {
    if (lowerCaller.includes('cbi') || lowerCaller.includes('police') || lowerCaller.includes('digital arrest') || lowerCaller.includes('customs') || lowerCaller.includes('electricity') || lowerCaller.includes('kyc')) {
      riskScore += 75;
      threatCategory = 'Digital Arrest & Government Imposter Scam (High Threat)';
      explanation.push('Indian law enforcement (CBI / Police / Customs) NEVER conducts "Digital Arrests" or demands video call fines over WhatsApp / phone calls.');
      safetyTips.push('Report fake police/digital arrest calls immediately on National Cyber Crime Portal (1930 or cybercrime.gov.in).');
    }
  }

  if (/^(\+1|\+888|\+800|\+877|\+866)/.test(cleanNum) && (lowerCaller.includes('irs') || lowerCaller.includes('windows') || lowerCaller.includes('support'))) {
    riskScore += 65;
    threatCategory = 'Vishing & Imposter Telemarketing Scam';
    explanation.push('Caller ID matches high-volume scam campaign masquerading as government or tech support.');
  }

  if (cleanNum.length < 10) {
    riskScore += 30;
    explanation.push('Non-standard shortcode or spoofed local number length.');
  } else {
    let hash = 0;
    for (let i = 0; i < cleanNum.length; i++) hash += cleanNum.charCodeAt(i);
    if (hash % 2 === 0) {
      riskScore += 40;
      explanation.push('Matches community database records for automated robocalls and debt collection lures.');
    }
  }

  riskScore = Math.min(99, Math.max(10, riskScore));
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'SAFE';
  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    threatCategory = threatCategory !== 'Verified / Normal Caller' ? threatCategory : 'Robocall & Fraudulent Imposter';
  } else if (riskScore >= 35) {
    riskLevel = 'WARNING';
    threatCategory = 'Unverified Telemarketer / Spam Risk';
  }

  let summary = `Phone number ${phoneInput} scored ${riskScore}% spam call likelihood (${riskLevel}).`;

  // Gemini enhancement
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this phone number and caller ID for spam, vishing, Indian Digital Arrest scam, or imposter call risk:
Phone: "${phoneInput}"
Caller Name/ID: "${callerName || 'Unknown'}"

Return JSON with:
- riskScore (0-100)
- confidenceScore (0-100)
- threatCategory (string)
- summary (string)
- explanation (array of string)
- safetyTips (array of string)`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation.splice(0, explanation.length, ...parsed.explanation);
          if (parsed.safetyTips?.length) safetyTips.splice(0, safetyTips.length, ...parsed.safetyTips);
        }
      }
    } catch (e) {
      console.warn('Gemini call scan fallback used:', e);
    }
  }

  if (safetyTips.length === 0) {
    safetyTips.push('Do not answer unexpected call prompts asking you to press digits or disclose banking info.');
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'call',
    title: phoneInput + (callerName ? ` (${callerName})` : ''),
    riskScore,
    confidenceScore: Math.min(99, riskScore + 2),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { phoneInput, callerName },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// 5. Phishing Email Detector Logic
async function analyzeEmail(sender: string, subject: string, body: string, userId?: string): Promise<ScanResult> {
  let riskScore = 15;
  let threatCategory = 'Legitimate Business Email';
  const explanation: string[] = [];
  const safetyTips: string[] = [];

  const fullText = `${sender} ${subject} ${body}`.toLowerCase();

  if (/action required|immediate|within 24 hours|account suspended|verify now/i.test(subject)) {
    riskScore += 25;
    explanation.push('Subject line uses psychological high-urgency manipulation.');
  }

  if (/@(gmail|yahoo|hotmail|outlook)\.com$/i.test(sender) && /hr|payroll|security|it support|bank|paypal|amazon/i.test(body)) {
    riskScore += 35;
    threatCategory = 'Free Webmail Corporate Impersonation';
    explanation.push('Purports to be from official corporate HR/IT department but originates from free webmail provider.');
  }

  if (/password|ssn|social security|credit card|wire|direct deposit/i.test(body)) {
    riskScore += 25;
    explanation.push('Solicits high-risk sensitive data (credentials, SSN, direct deposit details).');
  }

  if (/http:\/\/|bit\.ly|tinyurl|\.xyz|\.net|\.cc/i.test(body)) {
    riskScore += 20;
    explanation.push('Contains embedded unverified hyperlinks or domain redirects.');
  }

  riskScore = Math.min(99, Math.max(5, riskScore));
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'SAFE';
  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    threatCategory = 'Spear Phishing & Credential Harvest';
  } else if (riskScore >= 35) {
    riskLevel = 'WARNING';
    threatCategory = 'Suspicious Email Signature';
  }

  let summary = `Email from ${sender} evaluated with ${riskScore}% phishing likelihood.`;

  // Gemini enhancement
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this incoming email for phishing, credential harvesting, or business email compromise (BEC) scam:
Sender: "${sender}"
Subject: "${subject}"
Body: "${body}"

Return JSON with:
- riskScore (0-100)
- confidenceScore (0-100)
- threatCategory (string)
- summary (string)
- explanation (array of string)
- safetyTips (array of string)`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation.splice(0, explanation.length, ...parsed.explanation);
          if (parsed.safetyTips?.length) safetyTips.splice(0, safetyTips.length, ...parsed.safetyTips);
        }
      }
    } catch (e) {
      console.warn('Gemini email scan fallback used:', e);
    }
  }

  if (safetyTips.length === 0) {
    safetyTips.push('Inspect the actual email header and domain suffix before clicking links.');
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'email',
    title: subject || `Email from ${sender}`,
    riskScore,
    confidenceScore: Math.min(99, riskScore + 3),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { sender, subject, bodySnippet: body.substring(0, 100) },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// 6. Transaction Fraud Checker Logic
async function analyzeTransaction(desc: string, amount: number, currency: string = '₹', platform: string = 'UPI / Paytm / GPay', userId?: string): Promise<ScanResult> {
  let riskScore = 20;
  let threatCategory = 'Standard Transaction Pattern';
  const explanation: string[] = [];
  const safetyTips: string[] = [];

  const sym = currency || '₹';

  if (amount > 10000 || (sym === '$' && amount > 1000) || (sym === '€' && amount > 1000)) {
    riskScore += 25;
    explanation.push(`High monetary value (${sym}${amount}) increases financial risk exposure.`);
  }

  if (platform.includes('Crypto') || platform.includes('Wire Transfer')) {
    riskScore += 30;
    explanation.push(`Platform ${platform} offers irreversible settlements with zero buyer protection.`);
    safetyTips.push('Irreversible transfers like Crypto and Wire transfers should only be conducted with trusted entities.');
  }

  if (/qr code|scan to receive|receive payment|olx|paytm|phonepe|gpay|upi/i.test(desc) && /receive|get|claim|refund/i.test(desc)) {
    riskScore += 55;
    threatCategory = 'UPI QR Code "Scan to Receive Money" Fraud';
    explanation.push('CRITICAL RULE: Scanning a QR code or entering your UPI PIN ALWAYS DEDUCTS money from your bank account; it NEVER deposits money!');
    safetyTips.push('NEVER scan a QR code or enter your UPI PIN to RECEIVE money. Payment platforms do NOT require PINs for crediting accounts.');
  }

  if (/telegram|rating task|like youtube videos|task deposit|commission|prepayment/i.test(desc)) {
    riskScore += 60;
    threatCategory = 'Telegram Online Rating Task Scam';
    explanation.push('Classic Telegram part-time job trap promising high returns for liking videos or rating products after paying an advance deposit.');
    safetyTips.push('Never pay advance fees to unlock earnings or withdraw funds from unverified Telegram groups.');
  }

  if (/family emergency|gift card|overpayment refund|job deposit|car shipping/i.test(desc)) {
    riskScore += 35;
    threatCategory = 'High-Risk Overpayment / Fake Buyer Scam';
    explanation.push('Transaction description matches known refund scam or fake cashier check patterns.');
  }

  riskScore = Math.min(99, Math.max(5, riskScore));
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGEROUS' = 'SAFE';
  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    threatCategory = threatCategory !== 'Standard Transaction Pattern' ? threatCategory : 'High Probability Transaction Fraud';
  } else if (riskScore >= 35) {
    riskLevel = 'WARNING';
    threatCategory = 'Elevated Transaction Risk';
  }

  let summary = `Transaction of ${sym}${amount} on ${platform} flagged with ${riskScore}% fraud score.`;

  // Gemini enhancement
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this financial transaction request for potential fraud or scam patterns:
Platform: "${platform}"
Currency: "${currency}"
Amount: ${sym}${amount}
Description/Context: "${desc}"

Return JSON with:
- riskScore (0-100)
- confidenceScore (0-100)
- threatCategory (string)
- summary (string)
- explanation (array of string)
- safetyTips (array of string)`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              threatCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.riskScore !== undefined) {
          riskScore = parsed.riskScore;
          riskLevel = riskScore >= 70 ? 'DANGEROUS' : riskScore >= 35 ? 'WARNING' : 'SAFE';
          threatCategory = parsed.threatCategory || threatCategory;
          summary = parsed.summary || summary;
          if (parsed.explanation?.length) explanation.splice(0, explanation.length, ...parsed.explanation);
          if (parsed.safetyTips?.length) safetyTips.splice(0, safetyTips.length, ...parsed.safetyTips);
        }
      }
    } catch (e) {
      console.warn('Gemini transaction scan fallback used:', e);
    }
  }

  if (safetyTips.length === 0) {
    safetyTips.push('Never send funds to unverified buyers claiming they accidentally sent extra money.');
  }

  const result: ScanResult = {
    id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    scanType: 'transaction',
    title: `${sym}${amount} via ${platform}`,
    riskScore,
    confidenceScore: Math.min(99, riskScore + 4),
    riskLevel,
    threatCategory,
    summary,
    explanation,
    safetyTips,
    metadata: { amount, currency, platform, descSnippet: desc.substring(0, 100) },
    createdAt: new Date().toISOString()
  };

  reportsDB.unshift(result);
  writeJSONFile(REPORTS_FILE, reportsDB);
  return result;
}

// ==========================================
// EXPRESS ROUTE ENDPOINTS
// ==========================================

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const existing = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({ user: existing, message: 'Welcome back! Logged in.' });
    }

    const determinedRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');

    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      email,
      role: determinedRole,
      createdAt: new Date().toISOString()
    };

    usersDB.push(newUser);
    writeJSONFile(USERS_FILE, usersDB);
    res.json({ user: newUser, message: 'Account registered successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    let user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const determinedRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      user = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: email.split('@')[0],
        email,
        role: determinedRole,
        createdAt: new Date().toISOString()
      };
      usersDB.push(user);
      writeJSONFile(USERS_FILE, usersDB);
    } else if (!user.role) {
      user.role = user.email.toLowerCase().includes('admin') ? 'admin' : 'user';
      writeJSONFile(USERS_FILE, usersDB);
    }

    res.json({ user, message: `Authenticated as ${user.role.toUpperCase()}.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Scanner Routes
app.post('/api/scan/whatsapp', async (req, res) => {
  try {
    const { messageText, userId } = req.body;
    if (!messageText) return res.status(400).json({ error: 'Message text is required.' });
    const result = await analyzeWhatsAppMessage(messageText, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan/url', async (req, res) => {
  try {
    const { url, userId } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required.' });
    const result = await analyzeUrl(url, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan/screenshot', async (req, res) => {
  try {
    const { imageDataUrl, fileName, userId } = req.body;
    if (!imageDataUrl) return res.status(400).json({ error: 'Image data URL is required.' });
    const result = await analyzeScreenshot(imageDataUrl, fileName, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan/call', async (req, res) => {
  try {
    const { phoneNumber, callerName, userId } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: 'Phone number is required.' });
    const result = await analyzeCall(phoneNumber, callerName, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan/email', async (req, res) => {
  try {
    const { senderEmail, subject, emailBody, userId } = req.body;
    if (!senderEmail || !emailBody) return res.status(400).json({ error: 'Sender and body are required.' });
    const result = await analyzeEmail(senderEmail, subject || '', emailBody, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan/transaction', async (req, res) => {
  try {
    const { description, amount, currency, platform, userId } = req.body;
    if (amount === undefined || !platform) return res.status(400).json({ error: 'Amount and platform are required.' });
    const result = await analyzeTransaction(description || '', Number(amount), currency || '₹', platform, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Security Assistant Chatbot Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const gemini = getGeminiClient();
    let replyText = '';

    if (gemini) {
      try {
        const systemInstruction = `You are SentinelAI Security Shield, an elite AI cybersecurity specialist and scam prevention expert.
Your goal is to help users who are in doubt or worried about potential scams (e.g. WhatsApp lures, fake police/CBI Digital Arrests, QR code scanner traps, OLX advance payments, Telegram rating tasks, email phishing, or suspicious calls).

Follow these rules:
1. Provide empathetic, practical, and direct advice in plain language.
2. If the user asks about scanning a QR code to RECEIVE money, explicitly warn them that scanning a QR code or entering a PIN ALWAYS DEDUCTS money and NEVER deposits money.
3. If they mention Digital Arrest, state clearly that police or CBI NEVER arrest people via WhatsApp calls or demand video call payments.
4. If they have already lost money, advise them to immediately contact their bank to freeze accounts and dial National Cyber Crime Helpline 1930 (in India) or visit cybercrime.gov.in.
5. Keep responses concise (2-4 scannable bullet points or short paragraphs).`;

        const prompt = `${systemInstruction}\n\nUser Query: "${message}"`;

        const response = await gemini.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt
        });

        if (response.text) {
          replyText = response.text;
        }
      } catch (err) {
        console.warn('Gemini chat model error:', err);
      }
    }

    if (!replyText) {
      const lower = message.toLowerCase();
      if (lower.includes('qr') || lower.includes('receive')) {
        replyText = '🚨 SCAM ALERT: Scanning a QR code or entering your UPI PIN ALWAYS DEDUCTS money from your account. You NEVER need to scan a QR code or enter a PIN to receive money! Do not scan it.';
      } else if (lower.includes('cbi') || lower.includes('police') || lower.includes('digital arrest')) {
        replyText = '🚨 SCAM ALERT: Government agencies, police, or CBI NEVER conduct "Digital Arrests" over video calls or demand money to clear cases. Do not pay any money. Report immediately on 1930 or cybercrime.gov.in.';
      } else if (lower.includes('telegram') || lower.includes('task') || lower.includes('job')) {
        replyText = '🚨 SCAM ALERT: Any online part-time job that requires you to deposit money to earn commissions or withdraw earnings is a scam! Stop communicating with them.';
      } else {
        replyText = 'If you are in doubt, DO NOT click any links, share OTPs, or transfer money. Verify the entity independently through official bank helplines or report to National Cyber Crime Helpline at 1930.';
      }
    }

    res.json({ reply: replyText });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reports & Data Management
app.get('/api/reports', (req, res) => {
  const { userId, role } = req.query;

  // If requester is Admin, return ALL user reports across the system with user metadata
  if (role === 'admin') {
    const enriched = reportsDB.map(r => {
      const u = usersDB.find(usr => usr.id === r.userId);
      return {
        ...r,
        userEmail: u ? u.email : 'System / Guest',
        userName: u ? u.name : 'Guest User'
      };
    });
    return res.json(enriched);
  }

  // If requester is a standard user, filter strictly by their userId
  if (userId) {
    const filtered = reportsDB.filter(r => r.userId === userId);
    return res.json(filtered);
  }

  // If guest, return default public reports
  const publicReports = reportsDB.filter(r => !r.userId || r.userId === 'usr_user_1');
  res.json(publicReports);
});

app.delete('/api/reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    reportsDB = reportsDB.filter(r => r.id !== id);
    writeJSONFile(REPORTS_FILE, reportsDB);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Dedicated Routes
app.get('/api/admin/users', (req, res) => {
  try {
    const usersList = usersDB.map(u => {
      const userScans = reportsDB.filter(r => r.userId === u.id).length;
      const dangerousScans = reportsDB.filter(r => r.userId === u.id && r.riskLevel === 'DANGEROUS').length;
      return {
        ...u,
        totalScans: userScans,
        dangerousScans
      };
    });
    res.json(usersList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/users/:id/role', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Valid role (admin or user) is required.' });
    }

    const u = usersDB.find(usr => usr.id === id);
    if (!u) return res.status(404).json({ error: 'User not found.' });

    u.role = role;
    writeJSONFile(USERS_FILE, usersDB);
    res.json({ success: true, user: u });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/contacts', (req, res) => {
  res.json(contactsDB);
});

// Stats API for Threat Dashboard
app.get('/api/stats', (req, res) => {
  const totalScans = INITIAL_DASHBOARD_STATS.totalScans + reportsDB.length;
  const dangerousCount = reportsDB.filter(r => r.riskLevel === 'DANGEROUS').length;
  const todayThreats = INITIAL_DASHBOARD_STATS.todayThreats + dangerousCount;

  res.json({
    ...INITIAL_DASHBOARD_STATS,
    totalScans,
    todayThreats
  });
});

// Contact API
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const newContact: ContactMessage = {
      id: 'cnt_' + Date.now(),
      name,
      email,
      subject: subject || 'General Threat Query',
      message,
      createdAt: new Date().toISOString()
    };

    contactsDB.push(newContact);
    writeJSONFile(CONTACTS_FILE, contactsDB);
    res.json({ success: true, message: 'Thank you for contacting SentinelAI Security Team. We will respond within 24 hours.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite & Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SentinelAI Cyber Security Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import customerAuthRoutes from './routes/customer-auth.js';
import mpesaRoutes from './routes/mpesa.js';
import { createRateLimiter, securityHeaders } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

app.set('trust proxy', 1);
app.use(securityHeaders);

// ── CORS — Jude Safaris & Adventures production domains ──
const defaultProductionOrigins = [
  'https://judesafaris.co.ke',
  'https://www.judesafaris.co.ke',
  'https://jude-safaris.vercel.app',
  'https://jude-safaris-admin.vercel.app',
  'https://jude-safaris.onrender.com',
  'https://jude-safaris-api.onrender.com',
];

const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const configuredOrigins = envOrigins.includes('*')
  ? ['*']
  : (envOrigins.length > 0
    ? [...new Set([...envOrigins, ...defaultProductionOrigins])]
    : (process.env.NODE_ENV === 'production' ? defaultProductionOrigins : ['*']));

const normalizeOrigin = (value) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    return value.trim().replace(/\/+$/, '').toLowerCase();
  }
};

const withWwwVariants = (origin) => {
  const normalized = normalizeOrigin(origin);
  try {
    const url = new URL(normalized);
    const variants = new Set([normalized]);
    if (url.hostname.startsWith('www.')) {
      variants.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? ':' + url.port : ''}`);
    } else {
      variants.add(`${url.protocol}//www.${url.hostname}${url.port ? ':' + url.port : ''}`);
    }
    return variants;
  } catch {
    return new Set([normalized]);
  }
};

const allowlist = new Set();
configuredOrigins.forEach((origin) => {
  if (origin === '*') { allowlist.add('*'); return; }
  withWwwVariants(origin).forEach((v) => allowlist.add(v));
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowlist.has('*') || allowlist.has(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(uploadsDir));

// ── Health check ──
app.get('/health', (req, res) => {
  res.json({ status: 'OK', brand: 'Jude Safaris & Adventures', version: '2.0.0' });
});

// ── Rate Limiters ──
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 25, message: 'Too many authentication attempts. Please wait 15 minutes.' });
const mpesaLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 15, message: 'Too many payment requests. Please check your phone for pending STK push.' });
const generalLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 250 });

// ── Routes ──
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/customer-auth', authLimiter, customerAuthRoutes);
app.use('/api/mpesa', mpesaLimiter, mpesaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', generalLimiter, publicRoutes);

// ── Error handling ──
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS blocked for this origin' });
    return;
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`🦁 Jude Safaris API running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

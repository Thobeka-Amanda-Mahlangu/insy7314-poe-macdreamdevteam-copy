// backend/app.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import csurf from "csurf";

import authRoutes from "./routes/auth.js";
import txnRoutes from "./routes/transactions.js";
import { csrfProtection } from "./middleware/csrf.js";

dotenv.config();
const app = express();

// Security middleware
// Enhanced Helmet configuration for comprehensive protection
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // For React
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  frameguard: { 
    action: 'deny' // Prevent clickjacking - X-Frame-Options: DENY
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true, // X-Content-Type-Options: nosniff
  xssFilter: true, // X-XSS-Protection: 1; mode=block
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(cors({ 
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Limit request body size to prevent DoS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate limiting
app.use("/api/auth/login", rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later."
}));

// CSRF token route
app.get("/api/auth/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, { httpOnly: false, sameSite: "strict" });
  res.json({ csrfToken: token });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", csrfProtection, txnRoutes);

app.get("/health", (_, res) => res.send("OK"));

export default app;  // ✅ Export app for tests

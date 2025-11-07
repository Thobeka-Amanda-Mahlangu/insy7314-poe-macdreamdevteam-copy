// backend/app.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import csurf from "csurf";

import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { csrfProtection } from "./middleware/csrf.js";
import { httpLoggerMiddleware, correlationMiddleware } from "./utils/logger.js";
import log from "./utils/logger.js";

// Import models to register schemas (needed for populate)
import "./models/User.js";
import "./models/Employee.js";
import "./models/Transaction.js";

dotenv.config();
const app = express();

// Log startup
log.info("🚀 Employee Portal Backend starting...", {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5002
});

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
    action: 'deny' 
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true, 
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Allow both HTTP and HTTPS origins for development flexibility
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "https://localhost:3001",
  "http://localhost:3001",
  "http://localhost:3000" // Default React port for teammates
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log.warn("CORS: Origin not allowed", { origin });
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Limit request body size to prevent DoS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// HTTP Request Logging
app.use(correlationMiddleware);
app.use(httpLoggerMiddleware);

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
log.info("Registering API routes...");
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
log.info("Routes registered: /api/auth, /api/transactions");

app.get("/health", (req, res) => {
  log.debug("Health check requested", { ip: req.ip });
  res.send("OK");
});

export default app;  // Export app for tests

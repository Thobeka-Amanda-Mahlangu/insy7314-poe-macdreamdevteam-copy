// utils/logger.js

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
    Winston Logger Configuration for SonarQube Compliance
    
    Features:
    - Structured logging with proper log levels
    - Daily log rotation
    - Separate files for errors
    - JSON format for production (machine-readable)
    - Human-readable format for development
    - Correlation IDs for request tracking
    
    SonarQube & Logging Best Practices References (Harvard style):
    1. OWASP, 2025. *Logging Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. Winston Documentation, 2025. *Winston - A Multi-Transport Logger*. [online] Available at: <https://github.com/winstonjs/winston> [Accessed 9 October 2025].
    3. SonarQube, 2025. *Code Quality Rules*. [online] Available at: <https://www.sonarsource.com/products/sonarqube/> [Accessed 9 October 2025].
*/

const isProduction = process.env.NODE_ENV === "production";

// Custom format for development (colorized and readable)
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Custom format for production (JSON for parsing by log aggregators)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");

// Transport: Console (always enabled)
const consoleTransport = new winston.transports.Console({
  format: isProduction ? prodFormat : devFormat,
  level: isProduction ? "info" : "debug"
});

// Transport: Combined logs (all levels) with daily rotation
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d", // Keep logs for 14 days
  format: prodFormat,
  level: "info"
});

// Transport: Error logs only with daily rotation
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d", // Keep error logs for 30 days
  format: prodFormat,
  level: "error"
});

// Transport: Security audit logs (for authentication, authorization events)
const auditFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "audit-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "90d", // Keep audit logs for 90 days
  format: prodFormat,
  level: "info"
});

// Create logger instance
const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: prodFormat,
  transports: [
    consoleTransport,
    combinedFileTransport,
    errorFileTransport
  ],
  // Don't exit on error
  exitOnError: false
});

// Create separate audit logger
const auditLogger = winston.createLogger({
  level: "info",
  format: prodFormat,
  transports: [
    consoleTransport,
    auditFileTransport
  ],
  exitOnError: false
});

// Helper functions for common logging patterns
export const log = {
  // General logging
  debug: (message, meta = {}) => logger.debug(message, meta),
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, meta = {}) => logger.error(message, meta),

  // Security & Authentication events (goes to audit log)
  security: (action, details = {}) => {
    auditLogger.info(`SECURITY: ${action}`, {
      type: "security",
      action,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // Authentication events
  auth: {
    login: (userId, success = true, meta = {}) => {
      auditLogger.info(`AUTH: Login ${success ? "SUCCESS" : "FAILED"}`, {
        type: "auth",
        action: "login",
        userId,
        success,
        timestamp: new Date().toISOString(),
        ...meta
      });
    },
    logout: (userId, meta = {}) => {
      auditLogger.info("AUTH: Logout", {
        type: "auth",
        action: "logout",
        userId,
        timestamp: new Date().toISOString(),
        ...meta
      });
    },
    register: (userId, meta = {}) => {
      auditLogger.info("AUTH: User registered", {
        type: "auth",
        action: "register",
        userId,
        timestamp: new Date().toISOString(),
        ...meta
      });
    },
    tokenExpired: (userId, meta = {}) => {
      auditLogger.warn("AUTH: Token expired", {
        type: "auth",
        action: "token_expired",
        userId,
        timestamp: new Date().toISOString(),
        ...meta
      });
    }
  },

  // Database operations
  db: {
    connect: (database) => {
      logger.info("DATABASE: Connected", { database });
    },
    error: (operation, error) => {
      logger.error("DATABASE: Error", {
        operation,
        error: error.message,
        stack: error.stack
      });
    },
    query: (collection, operation, meta = {}) => {
      logger.debug("DATABASE: Query", {
        collection,
        operation,
        ...meta
      });
    }
  },

  // HTTP request logging
  http: {
    request: (method, path, statusCode, duration, meta = {}) => {
      const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
      logger[level]("HTTP: Request", {
        method,
        path,
        statusCode,
        duration: `${duration}ms`,
        ...meta
      });
    },
    error: (method, path, error, meta = {}) => {
      logger.error("HTTP: Error", {
        method,
        path,
        error: error.message,
        stack: error.stack,
        ...meta
      });
    }
  },

  // User operations (for payments portal)
  user: {
    created: (userId, accountNumber) => {
      auditLogger.info("USER: Created", {
        type: "user",
        action: "created",
        userId,
        accountNumber,
        timestamp: new Date().toISOString()
      });
    },
    updated: (userId, changes) => {
      auditLogger.info("USER: Updated", {
        type: "user",
        action: "updated",
        userId,
        changes,
        timestamp: new Date().toISOString()
      });
    },
    deleted: (userId) => {
      auditLogger.warn("USER: Deleted", {
        type: "user",
        action: "deleted",
        userId,
        timestamp: new Date().toISOString()
      });
    }
  },

  // Transaction operations
  transaction: {
    created: (transactionId, userId, amount, currency) => {
      logger.info("TRANSACTION: Created", {
        type: "transaction",
        action: "created",
        transactionId,
        userId,
        amount,
        currency,
        timestamp: new Date().toISOString()
      });
    },
    reviewed: (transactionId, employeeId, status, reason = null) => {
      auditLogger.info("TRANSACTION: Reviewed", {
        type: "transaction",
        action: "reviewed",
        transactionId,
        employeeId,
        status,
        reason,
        timestamp: new Date().toISOString()
      });
    },
    error: (transactionId, error) => {
      logger.error("TRANSACTION: Error", {
        type: "transaction",
        transactionId,
        error: error.message,
        stack: error.stack
      });
    }
  }
};

// Middleware to add correlation IDs to requests
export const correlationMiddleware = (req, res, next) => {
  req.correlationId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  res.setHeader("X-Correlation-ID", req.correlationId);
  next();
};

// Middleware to log HTTP requests
export const httpLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    log.http.request(
      req.method,
      req.originalUrl || req.url,
      res.statusCode,
      duration,
      {
        correlationId: req.correlationId,
        ip: req.ip,
        userAgent: req.get("user-agent")
      }
    );
  });

  next();
};

export default log;


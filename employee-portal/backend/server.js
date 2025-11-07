// backend/server.js
import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import log from "./utils/logger.js";

/*
    Security & Technical References (Harvard style):

    1. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. OWASP, 2025. *Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html> [Accessed 9 October 2025].
    3. OWASP, 2025. *Input Validation Cheat Sheet*. [online] Available at: 
       <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html> [Accessed 9 October 2025].
    4. Mozilla, 2025. *Express Security Best Practices*. [online] Available at: 
       <https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Security_best_practices> [Accessed 9 October 2025].
    5. Node.js, 2025. *HTTPS module*. [online] Available at: 
       <https://nodejs.org/api/https.html> [Accessed 9 October 2025].
*/

dotenv.config();

const PORT = process.env.PORT || 5002;
const keyPath = process.env.SSL_KEY_PATH || "./infra/certs/localhost+2-key.pem";
const certPath = process.env.SSL_CERT_PATH || "./infra/certs/localhost+2.pem";

log.info("🚀 Starting Employee Portal Backend Server...", {
  port: PORT,
  environment: process.env.NODE_ENV || 'development'
});

connectDB().then(() => {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    log.info("🔐 SSL certificates found, starting HTTPS server...");
    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    https.createServer(sslOptions, app).listen(PORT, () => {
      log.info(`✅ HTTPS server running on https://localhost:${PORT}`, {
        protocol: 'https',
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
      });
      console.log(`\n🎉 Employee Portal Backend is ready!`);
      console.log(`API Base: https://localhost:${PORT}/api`);
      console.log(`Health Check: https://localhost:${PORT}/health`);
      console.log(`View logs in: ./logs/\n`);
    });
  } else {
    log.warn("⚠️ SSL certs not found, falling back to HTTP");
    app.listen(PORT, () => {
      log.info(`HTTP server running on http://localhost:${PORT}`, {
        protocol: 'http',
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
      });
      console.log(`\nRunning on HTTP (SSL certs not found)`);
      console.log(`📍 API Base: http://localhost:${PORT}/api\n`);
    });
  }
}).catch((error) => {
  log.error("Failed to start server", {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

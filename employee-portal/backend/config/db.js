// backend/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import log from "../utils/logger.js";

dotenv.config();

const connectDB = async (useTestDB = false) => {
  const uri = useTestDB ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
  const dbName = useTestDB ? "TEST DB" : "MAIN DB";
  
  if (!uri) {
    log.error("MongoDB URI not defined in environment variables");
    throw new Error("MongoDB URI not defined");
  }

  log.info(`📡 Connecting to MongoDB (${dbName})...`);

  try {
    await mongoose.connect(uri, {
      ssl: true,
      tlsAllowInvalidCertificates: false
    });
    
    log.db.connect(dbName);
    log.info(`✅ MongoDB connected to ${dbName} securely (TLS)`, {
      host: mongoose.connection.host,
      database: mongoose.connection.name
    });
  } catch (err) {
    log.db.error("connect", err);
    log.error("❌ Database connection failed", {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Log MongoDB events
mongoose.connection.on('connected', () => {
  log.info('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  log.error('❌ Mongoose connection error', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  log.warn('⚠️ Mongoose disconnected from MongoDB');
});

export { connectDB };

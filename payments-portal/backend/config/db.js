// backend/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (useTestDB = false) => {
  const uri = useTestDB ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
  if (!uri) throw new Error("MongoDB URI not defined");

  try {
    await mongoose.connect(uri, {
      ssl: true,
      tlsAllowInvalidCertificates: false
    });
    console.log(`MongoDB connected to ${useTestDB ? "TEST DB" : "MAIN DB"} securely (TLS)`);
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

export { connectDB };

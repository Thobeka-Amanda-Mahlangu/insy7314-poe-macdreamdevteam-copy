import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/auth.js";
import { User } from "../models/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

beforeAll(async () => {
  await connectDB(true); // connect to test DB

  // Ensure test user exists
  const exists = await User.findOne({ accountNumber: "9987768876" });
  if (!exists) {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("P@55word552", 12);
    await User.create({
      fullName: "Nandi Msimanga",
      idNumber: "1987654329874",
      accountNumber: "9987768876",
      password: hashedPassword,
      role: "customer"
    });
    console.log("User created for testing: Nandi Msimanga");
  }
});

describe("User Authentication", () => {
  test("Existing user can log in", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        accountNumber: "9987768876",
        idNumber: "1987654329874",
        password: "P@55word552"
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("Login fails with wrong password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        accountNumber: "9987768876",
        idNumber: "1987654329874",
        password: "wrongPassword"
      });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  test("Cannot register with existing accountNumber", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Nandi Msimanga",
        idNumber: "1987654329874",
        accountNumber: "9987768876",
        password: "P@55word552"
      });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Account already exists");
  });
});

// ---------------- CLEANUP ---------------- //
afterAll(async () => {
  try {
    await User.deleteMany({ accountNumber: "9987768876" });
    console.log("Test users removed from test DB");
    // Close DB connection
    await import("mongoose").then(mongoose => mongoose.connection.close());
  } catch (err) {
    console.error("Error cleaning up test users:", err);
  }
});

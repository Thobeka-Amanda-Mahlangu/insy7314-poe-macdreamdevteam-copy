import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

import { connectDB } from "../config/db.js";
import authRoutes from "../routes/auth.js";
import transactionRoutes from "../routes/transactions.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

let testUserId;
let testUserToken;

beforeAll(async () => {
  await connectDB(true); // connect to test DB

  const user = await User.create({
    fullName: "Nandi Msimanga",
    idNumber: "1987654329874",
    accountNumber: "9987768876",
    password: "$2b$12$EXAMPLEHASH" // hashed password or create via bcrypt
  });
  testUserId = user._id;

  testUserToken = jwt.sign(
    { userId: testUserId, accountNumber: user.accountNumber, idNumber: user.idNumber },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
});

afterAll(async () => {
  await Transaction.deleteMany({ userId: testUserId });
  await User.deleteMany({ _id: testUserId });
  await mongoose.connection.close();
  console.log("✅ Test users and transactions removed from test DB");
});

describe("Transaction API", () => {
  test("Customer can create a valid transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({
        amount: 2000,
        currency: "ZAR",
        swift: "ABCDZAJJ"
      });

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(2000);
    expect(response.body.currency).toBe("ZAR");
    expect(response.body.swift).toBe("ABCDZAJJ");
  });

  test("Transaction fails with invalid amount", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({ amount: 0, currency: "ZAR", swift: "ABCDZAJJ" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid amount");
  });

  test("Transaction fails with invalid currency", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({ amount: 1000, currency: "ZAA", swift: "ABCDZAJJ" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid currency");
  });

  test("Transaction fails with invalid SWIFT code", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({ amount: 1000, currency: "ZAR", swift: "123" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid SWIFT code");
  });

  test("Customer can fetch all transactions", async () => {
    // Ensure there is at least one transaction in DB
    await Transaction.create({
      userId: testUserId,
      amount: 1500,
      currency: "ZAR",
      swift: "ABCDEZZZ"
    });

    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.some(tx => tx.userId._id.toString() === testUserId.toString())).toBe(true);
  });

  test("Fetching transactions fails without token", async () => {
    const response = await request(app).get("/api/transactions");
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Missing token");
  });
});

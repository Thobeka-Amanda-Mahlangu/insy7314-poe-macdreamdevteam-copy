import express from "express";
import currencyCodes from "currency-codes";
import { Transaction } from "../models/Transaction.js";
import { authRequired } from "../middleware/auth.js";


const router = express.Router(); // <- MUST be here

// GET all transactions
router.get("/", authRequired, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "fullName accountNumber");
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new transaction
router.post("/", authRequired, async (req, res) => {
  try {
    const { amount, currency, swift } = req.body;

    if (!amount || amount < 1) return res.status(400).json({ error: "Invalid amount" });
    if (!currencyCodes.code(currency)) return res.status(400).json({ error: "Invalid currency" });
    if (!/^[A-Z0-9]{8,11}$/.test(swift)) return res.status(400).json({ error: "Invalid SWIFT code" });

    const transaction = await Transaction.create({
      userId: req.user.userId,
      amount,
      currency,
      swift
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

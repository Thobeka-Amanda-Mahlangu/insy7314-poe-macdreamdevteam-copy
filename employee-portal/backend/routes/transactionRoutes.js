// employee-portal/backend/routes/transactionRoutes.js

import express from "express";
import { Transaction } from "../models/Transaction.js";
import { authenticateEmployee } from "../middleware/auth.js";
import log from "../utils/logger.js";

/*
    Transaction review routes for employee portal
    
    Security & Technical References (Harvard style):
    1. OWASP, 2025. *REST Security Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. MongoDB, 2025. *MongoDB Manual: Query Documents*. [online] Available at: <https://www.mongodb.com/docs/manual/tutorial/query-documents/> [Accessed 9 October 2025].
*/

const router = express.Router();

// -------------------- GET ALL TRANSACTIONS -------------------- //
router.get("/", authenticateEmployee, async (req, res) => {
  try {
    log.info("Fetching all transactions", { 
      employeeId: req.user.employeeId,
      correlationId: req.correlationId 
    });
    
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 }) // Newest first
      .populate({
        path: 'userId',
        select: 'fullName accountNumber idNumber'
      })
      .lean(); // Convert to plain objects

    // Handle cases where userId might not populate (deleted user, etc.)
    const safeTransactions = transactions.map(txn => ({
      ...txn,
      userId: txn.userId || {
        fullName: 'Unknown Customer',
        accountNumber: 'N/A',
        idNumber: 'N/A'
      }
    }));

    log.info(`Retrieved ${safeTransactions.length} transactions`, { 
      employeeId: req.user.employeeId,
      count: safeTransactions.length 
    });
    
    res.json({ 
      count: safeTransactions.length,
      transactions: safeTransactions
    });
  } catch (error) {
    log.error("Error fetching transactions", { 
      employeeId: req.user.employeeId,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ error: "Server error fetching transactions" });
  }
});

// -------------------- GET PENDING TRANSACTIONS -------------------- //
router.get("/pending", authenticateEmployee, async (req, res) => {
  try {
    log.info("Fetching pending transactions", { 
      employeeId: req.user.employeeId,
      correlationId: req.correlationId 
    });
    
    const transactions = await Transaction.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: 'fullName accountNumber idNumber'
      })
      .lean();

    // Handle cases where userId might not populate
    const safeTransactions = transactions.map(txn => ({
      ...txn,
      userId: txn.userId || {
        fullName: 'Unknown Customer',
        accountNumber: 'N/A',
        idNumber: 'N/A'
      }
    }));

    log.info(`Retrieved ${safeTransactions.length} pending transactions`, { 
      employeeId: req.user.employeeId,
      count: safeTransactions.length 
    });
    
    res.json({ 
      count: safeTransactions.length,
      transactions: safeTransactions
    });
  } catch (error) {
    log.error("Error fetching pending transactions", { 
      employeeId: req.user.employeeId,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ error: "Server error fetching pending transactions" });
  }
});

// -------------------- GET TRANSACTION BY ID -------------------- //
router.get("/:id", authenticateEmployee, async (req, res) => {
  try {
    log.info("Fetching transaction by ID", { 
      transactionId: req.params.id,
      employeeId: req.user.employeeId 
    });
    
    const transaction = await Transaction.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'fullName accountNumber idNumber'
      })
      .lean();

    if (!transaction) {
      log.warn("Transaction not found", { transactionId: req.params.id });
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Ensure userId has default values if not populated
    const safeTransaction = {
      ...transaction,
      userId: transaction.userId || {
        fullName: 'Unknown Customer',
        accountNumber: 'N/A',
        idNumber: 'N/A'
      }
    };

    log.info("Transaction retrieved", { 
      transactionId: req.params.id,
      status: transaction.status 
    });
    
    res.json(safeTransaction);
  } catch (error) {
    log.error("Error fetching transaction", { 
      transactionId: req.params.id,
      error: error.message 
    });
    res.status(500).json({ error: "Server error fetching transaction" });
  }
});

// -------------------- ACCEPT TRANSACTION -------------------- //
router.patch("/:id/accept", authenticateEmployee, async (req, res) => {
  try {
    log.info("✅ Employee attempting to ACCEPT transaction", { 
      transactionId: req.params.id,
      employeeId: req.user.employeeId,
      fullName: req.user.fullName,
      ip: req.ip
    });
    
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      log.warn("Transaction not found for acceptance", { 
        transactionId: req.params.id 
      });
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    if (transaction.status !== "pending") {
      log.warn("Transaction already reviewed", { 
        transactionId: req.params.id,
        currentStatus: transaction.status,
        employeeId: req.user.employeeId 
      });
      return res.status(400).json({ 
        error: `Transaction already reviewed (status: ${transaction.status})` 
      });
    }

    // Update transaction status
    transaction.status = "accepted";
    transaction.reviewedBy = req.user.employeeId;
    transaction.reviewedAt = new Date();
    await transaction.save();

    log.transaction.reviewed(
      transaction._id.toString(),
      req.user.employeeId,
      "accepted"
    );
    
    log.info(`Transaction ACCEPTED successfully`, { 
      transactionId: transaction._id,
      employeeId: req.user.employeeId,
      amount: transaction.amount,
      currency: transaction.currency
    });

    res.json({ 
      message: "Transaction accepted successfully", 
      transaction 
    });
  } catch (error) {
    log.transaction.error(req.params.id, error);
    log.error("Error accepting transaction", { 
      transactionId: req.params.id,
      employeeId: req.user.employeeId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: "Server error accepting transaction" });
  }
});

// -------------------- REJECT TRANSACTION -------------------- //
router.patch("/:id/reject", authenticateEmployee, async (req, res) => {
  try {
    const { reason } = req.body;
    
    log.info("Employee attempting to REJECT transaction", { 
      transactionId: req.params.id,
      employeeId: req.user.employeeId,
      fullName: req.user.fullName,
      ip: req.ip,
      reasonLength: reason ? reason.length : 0
    });
    
    // Validate rejection reason
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      log.warn("Rejection attempted without reason", { 
        transactionId: req.params.id,
        employeeId: req.user.employeeId 
      });
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    if (reason.trim().length < 10) {
      log.warn("Rejection reason too short", { 
        transactionId: req.params.id,
        employeeId: req.user.employeeId,
        length: reason.trim().length 
      });
      return res.status(400).json({ error: "Rejection reason must be at least 10 characters" });
    }

    if (reason.length > 500) {
      log.warn("Rejection reason too long", { 
        transactionId: req.params.id,
        employeeId: req.user.employeeId,
        length: reason.length 
      });
      return res.status(400).json({ error: "Rejection reason must be less than 500 characters" });
    }

    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      log.warn("Transaction not found for rejection", { 
        transactionId: req.params.id 
      });
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    if (transaction.status !== "pending") {
      log.warn("Transaction already reviewed", { 
        transactionId: req.params.id,
        currentStatus: transaction.status,
        employeeId: req.user.employeeId 
      });
      return res.status(400).json({ 
        error: `Transaction already reviewed (status: ${transaction.status})` 
      });
    }

    // Update transaction status
    transaction.status = "rejected";
    transaction.reviewedBy = req.user.employeeId;
    transaction.reviewedAt = new Date();
    transaction.rejectionReason = reason.trim();
    await transaction.save();

    log.transaction.reviewed(
      transaction._id.toString(),
      req.user.employeeId,
      "rejected",
      reason.trim()
    );
    
    log.info(`Transaction REJECTED successfully`, { 
      transactionId: transaction._id,
      employeeId: req.user.employeeId,
      amount: transaction.amount,
      currency: transaction.currency,
      reason: reason.trim().substring(0, 50) + '...'
    });

    res.json({ 
      message: "Transaction rejected successfully", 
      transaction 
    });
  } catch (error) {
    log.transaction.error(req.params.id, error);
    log.error(" Error rejecting transaction", { 
      transactionId: req.params.id,
      employeeId: req.user.employeeId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: "Server error rejecting transaction" });
  }
});

// -------------------- GET TRANSACTION STATISTICS -------------------- //
router.get("/stats/summary", authenticateEmployee, async (req, res) => {
  try {
    log.info(" Fetching transaction statistics", { 
      employeeId: req.user.employeeId 
    });
    
    const [total, pending, accepted, rejected] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: "pending" }),
      Transaction.countDocuments({ status: "accepted" }),
      Transaction.countDocuments({ status: "rejected" })
    ]);

    const stats = {
      total,
      pending,
      accepted,
      rejected,
      acceptanceRate: total > 0 ? ((accepted / total) * 100).toFixed(2) : 0
    };

    log.info("Statistics retrieved", { 
      employeeId: req.user.employeeId,
      stats 
    });

    res.json(stats);
  } catch (error) {
    log.error("Error fetching statistics", { 
      employeeId: req.user.employeeId,
      error: error.message 
    });
    res.status(500).json({ error: "Server error fetching statistics" });
  }
});

export default router;
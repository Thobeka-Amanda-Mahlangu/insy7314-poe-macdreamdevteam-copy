import mongoose from "mongoose";

/*
    Transaction schema definition for MongoDB using Mongoose.
    Includes:
    - userId reference to the User collection
    - amount (validated as number >=1)
    - currency (ISO 4217 3-letter codes, e.g., ZAR)
    - swift (validated 8-11 alphanumeric characters)
    - status with enum options
    - timestamps for createdAt and updatedAt
    - audit logging on save

    Security & Validation References
    1. MongoDB, 2025. *MongoDB Manual: Data Modeling*. [online] Available at: <https://www.mongodb.com/docs/manual/data-modeling/> [Accessed 9 October 2025].
    2. Mongoose, 2025. *Mongoose Documentation: Schemas*. [online] Available at: <https://mongoosejs.com/docs/guide.html> [Accessed 9 October 2025].
    3. ISO, 2025. *ISO 4217 Currency Codes*. [online] Available at: <https://www.iso.org/iso-4217-currency-codes.html> [Accessed 9 October 2025].
    4. SWIFT, 2025. *SWIFT Codes and Standards*. [online] Available at: <https://www.swift.com/standards/data-standards> [Accessed 9 October 2025].
*/

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  currency: { 
    type: String, 
    required: true, 
    match: /^[A-Z]{3}$/ // e.g., ZAR
  },
  swift: { 
    type: String, 
    required: true, 
    match: /^[A-Z0-9]{8,11}$/ // Valid SWIFT code
  },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  reviewedBy: {
    type: String, // Employee ID who reviewed this transaction
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Audit log for transaction creation
transactionSchema.post("save", doc =>
  console.log(`Transaction added: ${doc.amount} ${doc.currency} for user ${doc.userId}`)
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export { Transaction };

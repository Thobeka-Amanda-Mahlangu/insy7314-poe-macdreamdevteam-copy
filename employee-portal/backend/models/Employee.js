import mongoose from "mongoose";
import bcrypt from "bcrypt";
import log from "../utils/logger.js";

/*
    Employee schema definition for MongoDB using Mongoose.
    Simplified structure with only essential fields:
    - fullName: string, required (3-50 characters)
    - employeeId: string, required, unique (format: EMP followed by numbers)
    - password: string, required (automatically hashed with bcrypt - 12 rounds of salting)
    - timestamps: createdAt and updatedAt (automatic)

    Security & Validation References (Harvard style):
    1. MongoDB, 2025. *MongoDB Manual: Data Modeling*. [online] Available at: <https://www.mongodb.com/docs/manual/data-modeling/> [Accessed 9 October 2025].
    2. Mongoose, 2025. *Mongoose Documentation: Schemas*. [online] Available at: <https://mongoosejs.com/docs/guide.html> [Accessed 9 October 2025].
    3. OWASP, 2025. *Password Storage Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html> [Accessed 9 October 2025].
    4. Bcrypt Documentation, 2025. *Bcrypt for Node.js*. [online] Available at: <https://www.npmjs.com/package/bcrypt> [Accessed 9 October 2025].
*/

const SALT_ROUNDS = 12; // OWASP recommended minimum for bcrypt

const EmployeeSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  employeeId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  }, // Format: EMP followed by numbers
  password: { 
    type: String, 
    required: true 
  } // Will be hashed automatically
}, { timestamps: true });

// Middleware: Hash password before saving (only if password is modified)
EmployeeSchema.pre("save", async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    log.info("🔒 Password hashed for employee", { 
      employeeId: this.employeeId,
      saltRounds: SALT_ROUNDS 
    });
    next();
  } catch (error) {
    log.error("❌ Error hashing password", { 
      employeeId: this.employeeId,
      error: error.message 
    });
    next(error);
  }
});

// Method to compare password for authentication
EmployeeSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Audit log for employee creation
EmployeeSchema.post("save", doc => {
  log.employee.created(doc.employeeId, doc.fullName);
  log.info("✅ Employee saved to database", { 
    employeeId: doc.employeeId,
    fullName: doc.fullName,
    id: doc._id.toString()
  });
});

const Employee = mongoose.model("Employee", EmployeeSchema);

export { Employee };
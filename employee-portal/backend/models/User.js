

import mongoose from "mongoose";

/*
    User schema definition for MongoDB using Mongoose.
    
    This model represents customer accounts from the Payments Portal.
    It's imported into the Employee Portal to allow transaction population.
    
    Includes:
    - fullName: string, required
    - idNumber: string, required, unique
    - accountNumber: string, required, unique
    - password: string, required (hashed in payments portal backend)
    - role: string, default "customer"
    - timestamps for createdAt and updatedAt

    Security & Validation References (Harvard style):
    1. MongoDB, 2025. *MongoDB Manual: Data Modeling*. [online] Available at: <https://www.mongodb.com/docs/manual/data-modeling/> [Accessed 9 October 2025].
    2. Mongoose, 2025. *Mongoose Documentation: Schemas*. [online] Available at: <https://mongoosejs.com/docs/guide.html> [Accessed 9 October 2025].
    3. OWASP, 2025. *Password Storage Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html> [Accessed 9 October 2025].
*/

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed in payments portal backend
  role: { type: String, default: "customer" }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export { User };


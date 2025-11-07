// backend/routes/auth.js

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { validateRegister, validateLogin } from "../middleware/validate.js";

/*
    Authentication routes for customer portal (register & login)

    Security & Technical References (Harvard style):
    1. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. OWASP, 2025. *Password Storage Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html> [Accessed 9 October 2025].
    3. Bcrypt Documentation, 2025. *Bcrypt for Node.js*. [online] Available at: <https://www.npmjs.com/package/bcrypt> [Accessed 9 October 2025].
    4. JSON Web Tokens (JWT), 2025. *JWT Introduction*. [online] Available at: <https://jwt.io/introduction/> [Accessed 9 October 2025].
    5. OWASP, 2025. *REST Security Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> [Accessed 9 October 2025].
*/

const router = express.Router();
const SALT_ROUNDS = 12;

// -------------------- GET CSRF TOKEN -------------------- //

// -------------------- REGISTER -------------------- //
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body;

    // Check if account already exists
    const exists = await User.findOne({ accountNumber });
    if (exists) return res.status(409).json({ error: "Account already exists" });

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({ fullName, idNumber, accountNumber, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- LOGIN -------------------- //
// backend/routes/auth.js

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { idNumber, accountNumber, password } = req.body;
    console.log("🔐 Login payload received:", { idNumber, accountNumber });

    // Find user by idNumber + accountNumber
    const user = await User.findOne({ idNumber, accountNumber });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Issue JWT
    const token = jwt.sign(
      { userId: user._id, accountNumber: user.accountNumber, idNumber: user.idNumber },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token, user: { idNumber: user.idNumber, accountNumber: user.accountNumber } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

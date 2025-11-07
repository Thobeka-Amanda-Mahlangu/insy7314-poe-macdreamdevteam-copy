// backend/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee.js";
import { validateLogin } from "../middleware/validate.js";
import log from "../utils/logger.js";

/*

    Security & Technical References (Harvard style):
    1. OWASP, 2025. *Authentication Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. OWASP, 2025. *Password Storage Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html> [Accessed 9 October 2025].
    3. JSON Web Tokens (JWT), 2025. *JWT Introduction*. [online] Available at: <https://jwt.io/introduction/> [Accessed 9 October 2025].
    4. OWASP, 2025. *REST Security Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> [Accessed 9 October 2025].
*/

const router = express.Router();

// -------------------- LOGIN -------------------- //
router.post("/login", validateLogin, async (req, res) => {
  const { employeeId, password } = req.body;
  
  try {
    log.info("Employee login attempt", { employeeId, ip: req.ip });

    // Find employee by employeeId
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      log.auth.login(null, false, { 
        employeeId, 
        reason: "Employee not found",
        ip: req.ip 
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password using the model's comparePassword method
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      log.auth.login(employee._id.toString(), false, { 
        employeeId, 
        reason: "Invalid password",
        ip: req.ip 
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Issue JWT token
    const token = jwt.sign(
      { 
        userId: employee._id, 
        employeeId: employee.employeeId,
        fullName: employee.fullName
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Short-lived token for security
    );

    log.auth.login(employee._id.toString(), true, { 
      employeeId, 
      fullName: employee.fullName,
      ip: req.ip 
    });

    res.json({ 
      token, 
      user: { 
        employeeId: employee.employeeId, 
        fullName: employee.fullName
      } 
    });
  } catch (err) {
    log.error("Employee login error", { 
      employeeId, 
      error: err.message,
      stack: err.stack 
    });
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- GET CSRF TOKEN -------------------- //
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken ? req.csrfToken() : null });
});

export default router;
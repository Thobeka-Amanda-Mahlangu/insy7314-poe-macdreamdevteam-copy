import jwt from "jsonwebtoken";

/*
   
    
    Security References (Harvard style):
    1. OWASP, 2025. *REST Security Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> [Accessed 9 October 2025].
    2. JSON Web Tokens (JWT), 2025. *JWT Best Practices*. [online] Available at: <https://jwt.io/introduction/> [Accessed 9 October 2025].
*/

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach user info for next route
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Alias for clarity in employee portal context
export const authenticateEmployee = authRequired;
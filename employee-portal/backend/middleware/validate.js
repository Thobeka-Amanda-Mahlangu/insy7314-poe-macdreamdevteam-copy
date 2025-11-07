import R from "../utils/regex.js";

/*
    Input validation middleware for employee portal
    
    Note: Registration is disabled. Employee accounts are created via the addEmployee.js script.
    This middleware only validates login requests.
    
    Security References (Harvard style):
    1. OWASP, 2025. *Input Validation Cheat Sheet*. [online] Available at: <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html> [Accessed 9 October 2025].
*/

// Login validation - validates employeeId and password presence
export function validateLogin(req, res, next) {
  const { employeeId, password } = req.body;

  if (!employeeId || typeof employeeId !== "string") {
    return res.status(400).json({ error: "Employee ID required" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password required" });
  }

  // Optional: Validate employeeId format (EMP followed by numbers)
  if (!R.employeeId.test(employeeId)) {
    return res.status(400).json({ error: "Invalid employee ID format" });
  }

  next();
}

// Employee data validation for administrative operations (used by addEmployee script)
export function validateEmployeeData(data) {
  const errors = [];

  if (!R.name.test(data.fullName)) {
    errors.push("Invalid name format. Must be 3-50 characters (letters, spaces, apostrophes, hyphens only)");
  }

  if (!R.employeeId.test(data.employeeId)) {
    errors.push("Invalid employee ID. Must start with 'EMP' followed by 5-10 digits");
  }

  if (!R.password.test(data.password)) {
    errors.push("Weak password. Must be at least 8 characters with uppercase, number, and special character");
  }

  return errors;
}
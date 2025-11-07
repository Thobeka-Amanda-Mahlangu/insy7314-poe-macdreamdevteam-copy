import R from "../utils/regex.js";

export function validateRegister(req, res, next) {
  const { fullName, idNumber, accountNumber, password } = req.body;

  if (!R.name.test(fullName)) 
    return res.status(400).json({ error: "Invalid name" });

  if (!R.idNumber.test(idNumber)) 
    return res.status(400).json({ error: "Invalid ID" });

  if (!R.accountNumber.test(accountNumber)) 
    return res.status(400).json({ error: "Invalid account" });

  if (!R.password.test(password)) 
    return res.status(400).json({ error: "Weak password" });

  next();
}

export function validateLogin(req, res, next) {
  const { accountNumber, password } = req.body;

  if (!accountNumber || typeof accountNumber !== "string") 
    return res.status(400).json({ error: "Account number required" });

  if (!password || typeof password !== "string") 
    return res.status(400).json({ error: "Password required" });

  next();
}

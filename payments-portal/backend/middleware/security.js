import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,                  // max login attempts
  standardHeaders: true,    // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." }
});

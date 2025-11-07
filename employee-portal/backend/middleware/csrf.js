import csurf from "csurf";

const csrfProtection = csurf({
  cookie: {
    httpOnly: false, // allow frontend JS to read token cookie
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  }
});

export { csrfProtection };

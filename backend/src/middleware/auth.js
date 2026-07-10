import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Attaches req.user when a valid Bearer token is present (non-blocking).
export function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = { id: decoded.sub || decoded.id, email: decoded.email };
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
}

// Hard gate — returns 401 when no valid token.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized", message: "Missing token" });
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.sub || decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

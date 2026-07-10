import { Router } from "express";
import { register, login, me, forgotPassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate, rules } from "../middleware/validate.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Stricter limit on auth endpoints to blunt brute-force / abuse.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const registerSchema = {
  body: {
    name: [rules.required, rules.isString, rules.minLength(2), rules.maxLength(60)],
    email: [rules.required, rules.isEmail, rules.maxLength(120)],
    password: [rules.required, rules.minLength(6), rules.maxLength(128)],
    role: [rules.isString, rules.maxLength(60)],
  },
};

const loginSchema = {
  body: {
    email: [rules.required, rules.isEmail],
    password: [rules.required, rules.minLength(6)],
  },
};

const forgotSchema = {
  body: { email: [rules.required, rules.isEmail] },
};

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot", authLimiter, validate(forgotSchema), forgotPassword);
router.get("/me", requireAuth, me);

export default router;

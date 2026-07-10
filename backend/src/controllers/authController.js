import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../middleware/errorHandler.js";

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    skills: user.skills,
    location: user.location,
    phone: user.phone,
    strength: user.strength,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    role: role || "Aspiring Developer",
  });
  const access_token = signToken({ sub: user._id.toString(), email: user.email });
  res.status(201).json({ access_token, user: sanitize(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Invalid credentials");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, "Invalid credentials");
  }
  const access_token = signToken({ sub: user._id.toString(), email: user.email });
  res.json({ access_token, user: sanitize(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(404, "User not found");
  res.json(sanitize(user));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  // Always return the same response to avoid account enumeration.
  if (user) {
    console.info(`[auth] password reset requested for ${email}`);
  }
  res.json({
    message:
      "If an account exists for that email, a reset link has been sent. (Email delivery is disabled in this build.)",
  });
});

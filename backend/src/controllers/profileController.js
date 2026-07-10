import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { ensureProfile } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../middleware/errorHandler.js";

const EDITABLE = [
  "phone",
  "college",
  "degree",
  "branch",
  "graduationYear",
  "skills",
  "projects",
  "experience",
  "linkedIn",
  "github",
  "location",
  "summary",
  "resumeUrl",
  "profileImage",
  "targetRole",
];

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) throw new HttpError(404, "User not found");
  const profile = await ensureProfile(req.user.id);
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    ...profile.toObject(),
    user: undefined,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await ensureProfile(req.user.id);
  for (const key of EDITABLE) {
    if (req.body[key] !== undefined) profile[key] = req.body[key];
  }
  // Keep auth-level basics in sync.
  if (req.body.name !== undefined) await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
  if (req.body.role !== undefined) await User.findByIdAndUpdate(req.user.id, { role: req.body.role });
  if (req.body.avatar !== undefined) await User.findByIdAndUpdate(req.user.id, { avatar: req.body.avatar });
  if (req.body.profileImage !== undefined) await User.findByIdAndUpdate(req.user.id, { avatar: req.body.profileImage });
  if (req.body.location !== undefined) await User.findByIdAndUpdate(req.user.id, { location: req.body.location });
  if (req.body.skills !== undefined) await User.findByIdAndUpdate(req.user.id, { skills: req.body.skills });

  await profile.save();
  res.json({ id: req.user.id, ...profile.toObject(), user: undefined });
});

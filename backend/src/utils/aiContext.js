import User from "../models/User.js";
import Profile from "../models/Profile.js";

// Loads the auth user + extended profile and returns a flat, AI-friendly context.
export async function getUserContext(userId) {
  const user = await User.findById(userId).lean();
  const profile = await Profile.findOne({ user: userId }).lean();
  return {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || profile?.targetRole || "",
    skills: profile?.skills || user?.skills || [],
    projects: profile?.projects || [],
    experience: profile?.experience || [],
    education: [profile?.college, profile?.degree, profile?.branch]
      .filter(Boolean)
      .join(", "),
    location: profile?.location || user?.location || "",
    targetRole: profile?.targetRole || user?.role || "",
    linkedIn: profile?.linkedIn || "",
    github: profile?.github || "",
  };
}

// Returns the profile doc, creating it on first use.
export async function ensureProfile(userId) {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create({ user: userId });
  }
  return profile;
}

// Deterministic 0-100 readiness derived from real user data (used as a fallback
// and as a transparent default before any AI analysis exists).
export function computeReadiness(ctx = {}) {
  const signals = [
    (ctx.skills?.length || 0) >= 3 ? 20 : (ctx.skills?.length || 0) * 5,
    ctx.projects?.length ? Math.min(25, ctx.projects.length * 8) : 0,
    ctx.experience?.length ? Math.min(20, ctx.experience.length * 10) : 0,
    ctx.education ? 15 : 0,
    ctx.linkedIn || ctx.github ? 10 : 0,
    ctx.summary || ctx.targetRole ? 10 : 0,
  ];
  return Math.min(100, signals.reduce((a, b) => a + b, 0));
}

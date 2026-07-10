import CodingSession from "../models/CodingSession.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCoding = asyncHandler(async (req, res) => {
  const sessions = await CodingSession.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json({ sessions: sessions.map((s) => ({ ...s, id: s._id.toString() })) });
});

export const saveCoding = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const session = await CodingSession.create({
    user: req.user.id,
    problem: body.problem || {},
    language: body.language || "javascript",
    code: body.code || "",
    passed: body.passed || 0,
    total: body.total || 0,
    score: body.score ?? Math.round(((body.passed || 0) / Math.max(1, body.total || 1)) * 100),
    durationSec: body.durationSec || 0,
  });
  res.status(201).json({ ...session.toObject(), id: session._id.toString() });
});

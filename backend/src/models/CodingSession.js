import mongoose from "mongoose";

const CodingSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problem: {
      question: String,
      difficulty: String,
      tags: [String],
    },
    language: { type: String, default: "javascript" },
    code: String,
    passed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    score: Number,
    durationSec: Number,
  },
  { timestamps: true }
);

export default mongoose.model("CodingSession", CodingSessionSchema);

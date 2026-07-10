import mongoose from "mongoose";

// Standalone ATS scan results (can be run on a resume or on the profile directly).
const ATSResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    targetRole: String,
    score: Number,
    keywordsFound: [String],
    keywordsMissing: [String],
    tips: [String],
  },
  { timestamps: true }
);

export default mongoose.model("ATSResult", ATSResultSchema);

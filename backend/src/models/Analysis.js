import mongoose from "mongoose";

// Generic store for AI-generated analyses (career, skillgap, roadmap, ats, etc.)
const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true }, // career | skillgap | roadmap | ats
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

analysisSchema.index({ user: 1, type: 1 });

export default mongoose.model("Analysis", analysisSchema);

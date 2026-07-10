import mongoose from "mongoose";

// Periodic snapshot of a user's scores, used to power the analytics charts.
const AnalyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    careerScore: Number,
    atsScore: Number,
    interviewScore: Number,
    learningProgress: Number,
    jobMatch: Number,
    resumeScore: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", AnalyticsSchema);

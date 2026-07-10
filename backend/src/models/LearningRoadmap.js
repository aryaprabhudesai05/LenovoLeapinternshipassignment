import mongoose from "mongoose";

const LearningRoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goal: String,
    steps: [
      {
        title: String,
        weeks: String,
        detail: String,
        status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("LearningRoadmap", LearningRoadmapSchema);

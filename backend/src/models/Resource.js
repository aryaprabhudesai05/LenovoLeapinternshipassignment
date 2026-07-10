import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    type: { type: String, enum: ["Article", "Video", "Course", "Guide"] },
    tag: String,
    read: String,
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);

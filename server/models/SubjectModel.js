import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null }, // ✅ optional

}, { timestamps: true });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;

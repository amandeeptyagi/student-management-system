import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  day: { type: String, required: true }, // e.g., "monday"
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;

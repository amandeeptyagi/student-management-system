import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
});

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;

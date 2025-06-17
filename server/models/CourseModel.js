import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  semesters: [
    {
      number: { type: Number, required: true },
      subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    },
  ],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;

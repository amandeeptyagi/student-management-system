import mongoose from "mongoose";
import Subject from "./SubjectModel.js";

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

// Pre-delete middleware to delete associated subjects
courseSchema.pre("findOneAndDelete", async function (next) {
  const course = await this.model.findOne(this.getQuery());

  if (!course) return next(); // If no course found, move on

  const subjectIdsToDelete = course.semesters.flatMap(s => s.subjectIds);

  if (subjectIdsToDelete.length > 0) {
    await Subject.deleteMany({ _id: { $in: subjectIdsToDelete } });
  }

  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;

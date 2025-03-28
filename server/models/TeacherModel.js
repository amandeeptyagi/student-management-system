import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  password: { type: String, required: true }
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;

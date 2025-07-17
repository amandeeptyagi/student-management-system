import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Teacher from "./TeacherModel.js" // import related models
import Student from "./StudentModel.js";
import Course from "./CourseModel.js";
import Subject from "./SubjectModel.js";
import Lecture from "./LectureModel.js";

const adminSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instituteName: { type: String, required: true },
    address: {type: String, required: true },
    role: { type: String, enum: ["admin"], required: true, default: "admin" }
  },
  { timestamps: true }
);

// Pre-delete middleware to delete related data
adminSchema.pre("findOneAndDelete", async function (next) {
  const adminId = this.getQuery()._id;

  await Teacher.deleteMany({ admin: adminId });
  await Student.deleteMany({ admin: adminId });
  await Course.deleteMany({ admin: adminId });
  await Subject.deleteMany({ createdBy: adminId });
  await Lecture.deleteMany({ admin: adminId });

  next();
});

// // Hash password before saving user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare passwords
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

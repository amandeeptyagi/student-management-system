import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  department: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
}, { timestamps: true });

// // Hash password before saving user
// studentSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare passwords
// studentSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const Student = mongoose.model("Student", studentSchema);
export default Student;

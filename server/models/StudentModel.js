import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null},
  year: { type: Number, default: null },
  semester: { type: Number, default: null },
  branch: { type: String, default: null },
  address: { type: String, required: true },
  role: { type: String, enum: ["student"], required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true });

studentSchema.pre("save", function (next) {
  if (this.semester) {
    this.year = Math.ceil(this.semester / 2);
  } else {
    this.year = null;
  }
  next();
});


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

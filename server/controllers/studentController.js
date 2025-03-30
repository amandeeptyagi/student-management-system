import Student from "../models/StudentModel.js";
import Course from "../models/CourseModel.js";
import bcrypt from "bcryptjs";

// Get Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change Password
export const updateStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    if (oldPassword !== student.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get students course details
export const getStudentCourses = async (req, res) => {
  try {
    const studentCourses = await Course.find({ students: req.user.id })
      .populate("subjects", "name")
      .populate({
        path: "subjects",
        // select: 'name teacher',
        populate: { path: "teacher", select: "name" },
      });

    res.json(studentCourses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

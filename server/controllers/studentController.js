import Student from "../models/StudentModel.js";
import Course from "../models/CourseModel.js";
import bcrypt from "bcryptjs";

// Get Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate({
        path: "course",
        select: "name duration semesters",
      })
      .select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student profile", error });
  }
};


// Change Password
export const updateStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.user._id);

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
export const getCourseDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findOne({ _id: student.course })
      .populate({
        path: "semesters.subjectIds",
        model: "Subject",
      });

    if (!course) return res.status(404).json({ message: "Course not found" });

    const currentSemester = course.semesters.find(s => s.number === student.semester);
    if (!currentSemester) return res.status(404).json({ message: "Semester not found in course" });

    res.status(200).json({
      courseName: course.name,
      duration: course.duration,
      semester: student.semester,
      subjects: currentSemester.subjectIds,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course details", error });
  }
};
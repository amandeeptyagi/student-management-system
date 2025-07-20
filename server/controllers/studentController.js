import Student from "../models/StudentModel.js";
import Course from "../models/CourseModel.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import Lecture from "../models/LectureModel.js";


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
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const course = await Course.findById(student.course).populate({
      path: "semesters.subjectIds",
      model: "Subject",
      populate: {
        path: "teacher",
        model: "Teacher",
        select: "name email specialization"
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const currentSemester = course.semesters.find(
      (s) => s.number === student.semester
    );

    res.status(200).json({
      courseName: course.name,
      duration: course.duration,
      currentSemesterNumber: student.semester,
      currentSubjects: currentSemester?.subjectIds || [],
      allSemesters: course.semesters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch full course details", error });
  }
};


// get today's schedule for student
export const getTodayScheduleForStudent = async (req, res) => {
  try {
    // Step 1: Get student details
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // const today = moment().format("dddd").toLowerCase(); // e.g., "wednesday"
    const today = moment().format("dddd"); // e.g., "Wednesday"

    // Step 2: Find today's lectures matching student’s course, semester & admin
    const lectures = await Lecture.find({
      course: student.course,
      semester: student.semester,
      admin: student.admin,
      day: today,
    })
      .populate("subject", "name code")
      .populate("teacher", "name email specialization")
      .sort({ timeSlot: 1 });

    res.status(200).json({
      date: today,
      totalLectures: lectures.length,
      lectures,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's schedule", error });
  }
};

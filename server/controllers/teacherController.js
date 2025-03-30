import Teacher from "../models/TeacherModel.js";
import Lecture from "../models/LectureModel.js";
import bcrypt from "bcryptjs";

// Get Teacher Profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change Password
export const updateTeacherPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    if (oldPassword !== teacher.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    teacher.password = newPassword;
    await teacher.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get teacher time table
export const getTeacherTimetable = async (req, res) => {
    try {
      const timetable = await Lecture.find({ teacher: req.user.id })
        .populate("course", "name")
        .populate("subject", "name");
  
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

import bcrypt from "bcryptjs";
import Admin from "../models/AdminModel.js"
import Teacher from "../models/TeacherModel.js";
import Student from "../models/StudentModel.js";
import Course from "../models/CourseModel.js";

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.user.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedAdmin = await user.save();
      res.json({ _id: updatedAdmin._id, name: updatedAdmin.name, email: updatedAdmin.email, role: updatedAdmin.role });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if old password is correct
    if (oldPassword !== admin.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Save new password
    admin.password = newPassword
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Add a New Student
export const addStudent = async (req, res) => {
  try {
    const { rollNo, name, email, courseId, department, address, password } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = new Student({ rollNo, name, email, course: courseId, department, address, password, role:"student" });

    await student.save();
    await Course.findByIdAndUpdate(courseId, { $push: { students: student._id } });
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get All Students (Grouped by Course)
export const getStudents = async (req, res) => {
  try {
    const students = await Course.find().populate({
      path: "subjects",
      select: "name"
    }).populate({
      path: "students",
      select: "rollNo name email"
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Edit Student
export const updateStudent = async (req, res) => {
  try {
    const { rollNo, name, email, courseId } = req.body;
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.rollNo = rollNo || student.rollNo;
    student.name = name || student.name;
    student.email = email || student.email;
    student.course = courseId || student.course;
    // student.password = password || student.password;

    await student.save();
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove student from course's students array
    await Course.findByIdAndUpdate(student.course, { $pull: { students: id } });
    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Add a New Teacher
export const addTeacher = async (req, res) => {
  try {
    const { name, email, specialization, password } = req.body;

    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }


    const teacher = new Teacher({ name, email, specialization, password, role:"teacher" });
    await teacher.save();

    res.status(201).json({ message: "Teacher added successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get All Teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Edit Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, specialization } = req.body;
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.specialization = specialization || teacher.specialization;

    await teacher.save();
    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


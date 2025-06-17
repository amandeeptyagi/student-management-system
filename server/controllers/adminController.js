import bcrypt from "bcryptjs";
import Admin from "../models/AdminModel.js"
import Teacher from "../models/TeacherModel.js";
import Student from "../models/StudentModel.js";
import Course from "../models/CourseModel.js";
import generateToken from "../utils/generateToken.js";

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password, instituteName, address } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({
      name,
      email,
      mobile,
      password,
      instituteName,
      address,
      role: "admin",
    });

    const saved = await admin.save();
    // generateToken(res, saved._id, saved.role, null);

    res.status(201).json({ _id: saved._id, name: saved.name, email: saved.email, mobile: saved.mobile, instituteName: saved.instituteName, address: saved.address, role: saved.role });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  const { name, email, mobile, instituteName, address } = req.body;
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" })

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.mobile = mobile || admin.mobile;
    admin.instituteName = instituteName || admin.instituteName;
    admin.address = address || admin.address;

    const updated = await admin.save();
    res.status(201).json({ _id: updated._id, name: updated.name, email: updated.email, mobile: updated.mobile, instituteName: updated.instituteName, address: updated.address, role: updated.role });
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

// Delete Admin profile
export const deleteAdminProfile = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Admin profile deleted successfully" });
  } catch (error) {
  console.error("Delete Admin Error:", error);
  res.status(500).json({ message: "Server error, Failed to delete account", error: error.message });
}
}

// //  Add a New Student
export const addStudent = async (req, res) => {
  try {
    const { rollNo, name, email, mobile, password, courseId, semester, branch, address } = req.body;

    const course = await Course.findOne({ _id: courseId, admin: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found or not authorized" });

    // const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      rollNo,
      name,
      email,
      mobile,
      password: password,
      course: courseId,
      semester,
      branch,
      address,
      role: "student",
      admin: req.user._id,
    });

    const saved = await student.save();
    res.status(201).json({ message: "Student added successfully", saved });
  } catch (error) {
    res.status(500).json({ message: "Failed to add student", error });
  }
};

//  Get All Students (Grouped by Course)
export const getAllStudents = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get all courses of this admin
    const courses = await Course.find({ admin: adminId });

    const result = [];

    for (const course of courses) {
      const courseData = {
        courseId: course._id,
        courseName: course.name,
        semesters: [],
      };

      for (let sem = 1; sem <= course.semesters.length; sem++) {
        const students = await Student.find({
          course: course._id,
          semester: sem,
        }).select("-password"); // Exclude password

        if (students.length > 0) {
          courseData.semesters.push({
            semesterNumber: sem,
            students,
          });
        }
      }

      result.push(courseData);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students", error });
  }
};

//  Edit Student
export const updateStudent = async (req, res) => {
  try {
        const { rollNo, name, email, mobile, password, courseId, semester, branch, address } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student || student.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or student not found" });
    }

    if (rollNo) student.rollNo = rollNo;
    if (name) student.name = name;
    if (email) student.email = email;
    if (mobile) student.mobile = mobile;
    if (password) student.password = password;
    if (courseId) student.course = courseId;
    if (semester) {
      student.semester = semester;
      student.year = Math.ceil(semester / 2);
    }
    if (branch) student.branch = branch;
    if (address) student.address = address;

    const updated = await student.save();
    res.status(200).json({ message: "Student updated", updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update student", error });
  }
};

//  Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student || student.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or student not found" });
    }

    // Remove student from course's students array
    //await Course.findByIdAndUpdate(student.course, { $pull: { students: id } });
    //await Student.findByIdAndDelete(id);
    await student.deleteOne();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Add a New Teacher
export const addTeacher = async (req, res) => {
  try {
    const { name, email, mobile, specialization, department, address, password } = req.body;

    // Check if teacher already exists
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create teacher linked with admin
    const teacher = new Teacher({
      name,
      email,
      mobile,
      specialization,
      department,
      address,
      password: password,
      role: "teacher",
      admin: req.user._id  // current logged-in admin ID
    });

    const saved = await teacher.save();

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      mobile: saved.mobile,
      specialization: saved.specialization,
      department: saved.department,
      address: saved.address,
      admin: saved.admin,
      role: saved.role,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Server error while creating teacher" });
  }
};

//  Get All Teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ admin: req.user._id }).select("-password");
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error while fetching teachers" });
  }
};

//  Edit Teacher
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. Not your teacher." });
    }

    const { name, email, mobile, specialization, department, address, password } = req.body;

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.mobile = mobile || teacher.mobile;
    teacher.specialization = specialization || teacher.specialization;
    teacher.department = department || teacher.department;
    teacher.address = address || teacher.address;
    teacher.password = password || teacher.password;

    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   teacher.password = await bcrypt.hash(password, salt);
    // }

    const updatedTeacher = await teacher.save();

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: {
        _id: updatedTeacher._id,
        name: updatedTeacher.name,
        email: updatedTeacher.email,
        mobile: updatedTeacher.mobile,
        specialization: updatedTeacher.specialization,
        department: updatedTeacher.department,
        address: updatedTeacher.address,
        role: updatedTeacher.role,
      },
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. Not your teacher." });
    }

    await teacher.deleteOne();

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Server error while deleting teacher" });
  }
};



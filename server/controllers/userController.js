import bcrypt from "bcryptjs";
import Student from "../models/StudentModel.js";
import Teacher from "../models/TeacherModel.js";
import Course from "../models/CourseModel.js";

// ✅ 1. Add a New Student
export const addStudent = async (req, res) => {
  try {
    const { rollNo, name, courseId, password } = req.body;

    const studentExists = await Student.findOne({ rollNo });
    if (studentExists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ rollNo, name, course: courseId, password: hashedPassword });

    await student.save();
    await Course.findByIdAndUpdate(courseId, { $push: { students: student._id } });
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 2. Get All Students (Grouped by Course)
export const getStudents = async (req, res) => {
  try {
    const students = await Course.find().populate({
      path: "subjects",
      select: "name"
    }).populate({
      path: "students",
      select: "rollNo name"
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3. Edit Student
export const updateStudent = async (req, res) => {
  try {
    const { name, courseId } = req.body;
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.name = name || student.name;
    student.course = courseId || student.course;

    await student.save();
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 4. Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Remove student from course's students array
    await Course.findByIdAndUpdate(student.course, { $pull: { students: id } });
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 5. Add a New Teacher
export const addTeacher = async (req, res) => {
  try {
    const { userId, name, specialization, password } = req.body;

    const teacherExists = await Teacher.findOne({ userId });
    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ userId, name, specialization, password: hashedPassword });

    await teacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 6. Get All Teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 7. Edit Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, specialization } = req.body;
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.name = name || teacher.name;
    teacher.specialization = specialization || teacher.specialization;

    await teacher.save();
    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 8. Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


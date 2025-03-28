import Lecture from "../models/LectureModel.js";
import Teacher from "../models/TeacherModel.js";
import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";

export const assignLecture = async (req, res) => {
  try {
    const { teacherId, courseId, subjectId, timeSlot } = req.body;

    // Validate Teacher, Course & Subject
    const teacher = await Teacher.findById(teacherId);
    const course = await Course.findById(courseId);
    const subject = await Subject.findById(subjectId);

    if (!teacher || !course || !subject) {
      return res.status(404).json({ message: "Invalid teacher, course, or subject" });
    }

    // Create new Lecture
    const lecture = new Lecture({ teacher, course, subject, timeSlot });
    await lecture.save();

    res.status(201).json({ message: "Lecture assigned successfully", lecture });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch lectures for a teacher
export const getTeacherLectures = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const lectures = await Lecture.find({ teacher: teacherId })
      .populate("course", "name")
      .populate("subject", "name");

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

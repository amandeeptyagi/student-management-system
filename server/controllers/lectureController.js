import Lecture from "../models/LectureModel.js";
import Teacher from "../models/TeacherModel.js";
import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";

export const assignLecture = async (req, res) => {
  try {
    const { teacherId, courseId, subjectId, timeSlot, day } = req.body;

    // Validate Teacher, Course & Subject
    const teacher = await Teacher.findById(teacherId);
    const course = await Course.findById(courseId);
    const subject = await Subject.findById(subjectId);

    if (!teacher || !course || !subject) {
      return res.status(404).json({ message: "Invalid teacher, course, or subject" });
    }

    // Create new Lecture
    const lecture = new Lecture({ teacher, course, subject, timeSlot, day });
    await lecture.save();

    //subjects ke saath teacher ko assign kar dega
    await Subject.findByIdAndUpdate(subjectId, { teacher: teacherId });

    res.status(201).json({ message: "Lecture assigned successfully", lecture });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Fetch all lectures for all teachers
export const getAllLectures = async (req, res) => {
  try {
    // Fetch all lectures
    const lectures = await Lecture.find()
      .populate("course", "name")   // Populate course information
      .populate("subject", "name"); // Populate subject information
    
    // Check if any lectures are found
    if (!lectures || lectures.length === 0) {
      return res.status(404).json({ message: "No lectures found." });
    }

    // Respond with the list of all lectures
    res.status(200).json(lectures);
  } catch (error) {
    // Handle errors with appropriate error messages
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the lecture
    const deletedLecture = await Lecture.findByIdAndDelete(id);

    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


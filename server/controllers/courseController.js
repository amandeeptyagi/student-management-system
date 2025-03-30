import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";
import Lecture from "../models/LectureModel.js";

// ✅ 1. Add a New Course
export const addCourse = async (req, res) => {
  try {
    const { name } = req.body;
    const courseExists = await Course.findOne({ name });

    if (courseExists) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = new Course({ name });
    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 2. Get All Courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("subjects");
    // .populate("students", "rollNo name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3. Delete a Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
     // Find all subjects related to this course
     const subjects = await Subject.find({ course: id });

     // Extract subject IDs
     const subjectIds = subjects.map(subject => subject._id);
 
     // Delete all related subjects
     await Subject.deleteMany({ course: id });
 
     // Delete all lectures related to this course and its subjects
     await Lecture.deleteMany({ $or: [{ course: id }, { subject: { $in: subjectIds } }] });
 
     // Finally, delete the course
     await Course.findByIdAndDelete(id);
 
     res.json({ message: "Course, related subjects, and lectures deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 4. Add Subject to Course
export const addSubject = async (req, res) => {
  try {
    const { courseId, subjectName } = req.body;
    const subject = new Subject({ name: subjectName, course: courseId });
    await subject.save();

    await Course.findByIdAndUpdate(courseId, { $push: { subjects: subject._id } });

    res.status(201).json({ message: "Subject added successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 5. Delete Subject from Course
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    // await Subject.findByIdAndDelete(id);
 // Find the subject to be deleted
 const deletedSubject = await Subject.findByIdAndDelete(id);

 // Check if subject exists
 if (!deletedSubject) {
   return res.status(404).json({ message: "Subject not found" });
 }

 // Remove the subject reference from the Course collection
 await Course.updateOne(
   { _id: deletedSubject.course },
   { $pull: { subjects: deletedSubject._id } }
 );

 // Delete all lectures related to this subject
 await Lecture.deleteMany({ subject: deletedSubject._id });

 res.json({ message: "Subject and related lectures deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

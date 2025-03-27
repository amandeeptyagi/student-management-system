import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";

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
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3. Delete a Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: "Course deleted successfully" });
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
    await Subject.findByIdAndDelete(id);
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

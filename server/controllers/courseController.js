import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";
import Lecture from "../models/LectureModel.js";


// Create Course with Semesters
export const createCourse = async (req, res) => {
  try {
    const { name, duration } = req.body;
    const adminId = req.user._id;

    const semesters = [];
    for (let i = 1; i <= duration * 2; i++) {
      semesters.push({ number: i, subjectIds: [] });
    }

    const newCourse = new Course({ name, duration, semesters, admin: adminId });
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course", error });
    console.log(error);
  }
};

// Get all courses of this admin
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ admin: req.user._id }).populate({
      path: "semesters.subjectIds",
      select: "_id name code"
       });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to get courses" });
  }
};

// Update Course (name or duration)
export const updateCourse = async (req, res) => {
  try {
    const { name, duration } = req.body;
    const courseId = req.params.id;
    const adminId = req.user._id;

    const course = await Course.findOne({ _id: courseId, admin: adminId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (name) course.name = name;

    if (duration && duration !== course.duration) {
      const totalSemesters = duration * 2;
      const currentSemesters = course.semesters.length;

      if (totalSemesters > currentSemesters) {
        for (let i = currentSemesters + 1; i <= totalSemesters; i++) {
          course.semesters.push({ number: i, subjectIds: [] });
        }
      } else if (totalSemesters < currentSemesters) {
        const removedSubjectIds = course.semesters
          .filter(s => s.number > totalSemesters)
          .flatMap(s => s.subjectIds);

        course.semesters = course.semesters.filter(s => s.number <= totalSemesters);

        await Subject.deleteMany({ _id: { $in: removedSubjectIds }, createdBy: adminId });
      }

      course.duration = duration;
    }

    await course.save();
    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const adminId = req.user._id;

    const course = await Course.findOneAndDelete({ _id: courseId, admin: adminId });
    if (!course) return res.status(404).json({ message: "Course not found or not authorized" });

    const subjectIds = course.semesters.flatMap(s => s.subjectIds);
    await Subject.deleteMany({ _id: { $in: subjectIds }, createdBy: adminId });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error });
  }
};

// Get semesters of a specific course
export const getSemesters = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, admin: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course.semesters);
  } catch (error) {
    res.status(500).json({ message: "Failed to get semesters" });
  }
};

// Get subjects of a specific semester
export const getSubjects = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, admin: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const semester = course.semesters.find(s => s.number === Number(req.params.semesterNumber));
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    const subjects = await Subject.find({ _id: { $in: semester.subjectIds } });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to get subjects" });
  }
};

// Add subject to a semester
export const addSubject = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const course = await Course.findOne({ _id: req.params.courseId, admin: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const semester = course.semesters.find(s => s.number === Number(req.params.semesterNumber));
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    const newSubject = new Subject({ name, code, description, createdBy: req.user._id });
    await newSubject.save();

    semester.subjectIds.push(newSubject._id);
    await course.save();

    res.status(201).json({ message: "Subject created and added", subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: "Failed to add subject", error });
  }
};

// Update a subject
export const updateSubject = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject || subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or subject not found" });
    }

    if (name) subject.name = name;
    if (code) subject.code = code;
    if (description) subject.description = description;

    await subject.save();
    res.json({ message: "Subject updated", subject });
  } catch (error) {
    res.status(500).json({ message: "Failed to update subject", error });
  }
};

// Delete a subject from semester and DB
export const deleteSubject = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, admin: req.user._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const semester = course.semesters.find(s => s.number === Number(req.params.semesterNumber));
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    const subjectId = req.params.subjectId;
    semester.subjectIds = semester.subjectIds.filter(id => id.toString() !== subjectId);
    await course.save();

    const subject = await Subject.findById(subjectId);
    if (!subject || subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized or subject not found" });
    }

    await subject.deleteOne();
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subject", error });
  }
};

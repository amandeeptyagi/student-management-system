import Lecture from "../models/LectureModel.js";
import Teacher from "../models/TeacherModel.js";
import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";

// assign lecture
export const createLecture = async (req, res) => {
  try {
    const { teacher, course, semester, subject, day, timeSlot } = req.body;
    const admin = req.user._id;

    // Check Teacher exists
    const teacherExists = await Teacher.findOne({ _id: teacher });
    if (!teacherExists) return res.status(400).json({ message: "Invalid teacher selected" });

    // Check Course exists and belongs to this admin
    const courseExists = await Course.findOne({ _id: course, admin });
    if (!courseExists) return res.status(400).json({ message: "Invalid course" });

    // Check Semester exists
    const semesterData = courseExists.semesters.find(s => s.number === semester);
    if (!semesterData) return res.status(400).json({ message: "Invalid semester for this course" });

    // Check Subject exists in this semester
    if (!semesterData.subjectIds.includes(subject)) {
      return res.status(400).json({ message: "Selected subject does not belong to this course & semester" });
    }

    //Teacher busy?
    const teacherClash = await Lecture.findOne({ teacher, day, timeSlot });
    if (teacherClash) return res.status(400).json({ message: "Teacher already has a lecture at this time" });

    // Class already has lecture at same time?
    const classClash = await Lecture.findOne({ course, semester, subject, day, timeSlot });
    if (classClash) return res.status(400).json({ message: "This class already has a lecture at this time" });

    //All valid, Create Lecture
    const lecture = new Lecture({ teacher, course, semester, subject, day, timeSlot, admin });
    await lecture.save();

    res.status(201).json({ message: "Lecture assigned successfully", lecture });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign lecture", error });
  }
};


// Fetch all lectures for all courses
export const getLecturesByCourseAndSemester = async (req, res) => {
  try {
    const { courseId, semesterNumber } = req.params;
    const adminId = req.user._id;

    const course = await Course.findOne({ _id: courseId, admin: adminId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const semesterExists = course.semesters.find(s => s.number === Number(semesterNumber));
    if (!semesterExists) return res.status(404).json({ message: "Semester not found in this course" });

    const lectures = await Lecture.find({
      course: courseId,
      semester: Number(semesterNumber),
      admin: adminId,
    })
      .populate("teacher", "name email")
      .populate("subject", "name code")
      .sort({ day: 1, timeSlot: 1 });

    res.status(200).json({ lectures });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lectures", error });
  }
};

// edit lectures
export const updateLecture = async (req, res) => {
  try {
    const { teacher, subject, day, timeSlot } = req.body;
    const lectureId = req.params.lectureId;
    const adminId = req.user._id;

    const lecture = await Lecture.findOne({ _id: lectureId, admin: adminId });
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    // Optional clash checks if fields are being updated:
    if ((teacher || day || timeSlot) && (teacher !== lecture.teacher.toString() || day !== lecture.day || timeSlot !== lecture.timeSlot)) {
      const teacherClash = await Lecture.findOne({
        _id: { $ne: lectureId },
        teacher: teacher || lecture.teacher,
        day: day || lecture.day,
        timeSlot: timeSlot || lecture.timeSlot,
      });

      if (teacherClash) {
        return res.status(400).json({ message: "Teacher already has a lecture at this time" });
      }

      const classClash = await Lecture.findOne({
        _id: { $ne: lectureId },
        course: lecture.course,
        semester: lecture.semester,
        subject: subject || lecture.subject,
        day: day || lecture.day,
        timeSlot: timeSlot || lecture.timeSlot,
      });

      if (classClash) {
        return res.status(400).json({ message: "This class already has a lecture at this time" });
      }
    }

    if (teacher) lecture.teacher = teacher;
    if (subject) lecture.subject = subject;
    if (day) lecture.day = day;
    if (timeSlot) lecture.timeSlot = timeSlot;

    await lecture.save();
    res.status(200).json({ message: "Lecture updated successfully", lecture });
  } catch (error) {
    res.status(500).json({ message: "Failed to update lecture", error });
  }
};



export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findOneAndDelete({ _id: req.params.id, admin: req.user._id });
    if (!lecture) return res.status(404).json({ message: "Lecture not found or unauthorized" });

    res.status(200).json({ message: "Lecture deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete lecture", error });
  }
};



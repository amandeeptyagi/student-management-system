import express from "express";
import { createCourse, getAllCourses, updateCourse, deleteCourse,  getSemesters, getSubjects, addSubject, updateSubject, deleteSubject } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, createCourse); // Add Course
router.get("/", protect, adminOnly, getAllCourses); // View Courses
router.put("/update/:id", protect, adminOnly, updateCourse); // update Courses
router.delete("/delete/:id", protect, adminOnly, deleteCourse); // Delete Course

router.get("/:id/semesters", protect, adminOnly, getSemesters); // view Course Semesters

router.get("/:courseId/semesters/:semesterNumber/subjects", protect, adminOnly, getSubjects); // Get subjects of a semester
router.post("/:courseId/semesters/:semesterNumber/subjects", protect, adminOnly, addSubject); // Add Subject to semester
router.put("/subjects/:subjectId", protect, adminOnly, updateSubject); // update Subject from semester
router.delete("/:courseId/semesters/:semesterNumber/subjects/:subjectId", protect, adminOnly, deleteSubject); // delete Subject from semester

export default router;

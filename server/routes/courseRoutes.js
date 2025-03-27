import express from "express";
import { addCourse, getCourses, deleteCourse, addSubject, deleteSubject } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, addCourse); // Add Course
router.get("/", protect, adminOnly, getCourses); // View Courses
router.delete("/:id", protect, adminOnly, deleteCourse); // Delete Course

router.post("/subject/add", protect, adminOnly, addSubject); // Add Subject to Course
router.delete("/subject/:id", protect, adminOnly, deleteSubject); // Delete Subject from Course

export default router;

import express from "express";
import { createLecture, getLecturesByCourseAndSemester, updateLecture, deleteLecture } from "../controllers/lectureController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/assign", protect, adminOnly, createLecture); // Assign lecture
router.get("/:courseId/semesters/:semesterNumber", protect, adminOnly, getLecturesByCourseAndSemester); // Get lectures
router.put("/:lectureId", protect, adminOnly, updateLecture); // Edit lecture
router.delete("/:id", protect, adminOnly, deleteLecture); // delete lecture

export default router;

import express from "express";
import { assignLecture, getTeacherLectures } from "../controllers/lectureController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin can assign a lecture
router.post("/assign", protect, adminOnly, assignLecture);

// Teachers can view their assigned lectures
router.get("/:teacherId", protect, getTeacherLectures);

export default router;

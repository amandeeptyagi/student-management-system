import express from "express";
import { assignLecture, getAllLectures, deleteLecture } from "../controllers/lectureController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin can assign a lecture
router.post("/assign", protect, adminOnly, assignLecture);

// Admin can view their assigned lectures
router.get("/all", protect, adminOnly, getAllLectures);

// Admin can delete a lecture
router.delete("/:id", protect, adminOnly, deleteLecture);

export default router;

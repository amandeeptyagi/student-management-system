import express from "express";
import { getTeacherProfile, updateTeacherPassword, getTeacherTimetable } from "../controllers/teacherController.js";
import { protect, teacherOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get Teacher Profile
router.get("/profile", protect, teacherOnly, getTeacherProfile);
// Change Password
router.put("/change-password", protect, teacherOnly, updateTeacherPassword);
//time table
router.get("/timetable", protect, teacherOnly, getTeacherTimetable);


export default router;

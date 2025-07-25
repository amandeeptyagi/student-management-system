import express from "express";
import { getStudentProfile, updateStudentPassword, getCourseDetails, getTodayScheduleForStudent  } from "../controllers/studentController.js";
import { protect, studentOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get Student Profile
router.get("/profile", protect, studentOnly, getStudentProfile);
// Change Password
router.put("/change-password", protect, studentOnly, updateStudentPassword);
//get course details
router.get("/course-details", protect, studentOnly, getCourseDetails);
//get today's schedule
router.get("/today-classes", protect, studentOnly, getTodayScheduleForStudent);
export default router;

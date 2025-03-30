import express from "express";
import { getStudentProfile, updateStudentPassword, getStudentCourses } from "../controllers/studentController.js";
import { protect, studentOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get Student Profile
router.get("/profile", protect, studentOnly, getStudentProfile);

// Change Password
router.put("/change-password", protect, studentOnly, updateStudentPassword);

//get course details
router.get("/courses", protect, studentOnly, getStudentCourses);

export default router;

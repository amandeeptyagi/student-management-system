import express from "express";
import { registerAdmin, getAdminProfile, updateAdminProfile, changeAdminPassword, deleteAdminProfile, addStudent, getAllStudents, updateStudent, deleteStudent, addTeacher, getTeachers, updateTeacher, deleteTeacher } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { checkAdminRegistrationAllowed } from "../middlewares/checkSystemAccess.js";


const router = express.Router();

// Profile & Password Management Routes
router.post("/register",checkAdminRegistrationAllowed, registerAdmin);
router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile/update", protect, adminOnly, updateAdminProfile);
router.put("/profile/change-password", protect, adminOnly, changeAdminPassword);
router.delete("/profile/delete", protect, adminOnly, deleteAdminProfile);

// student management routes
router.post("/student/add", protect, adminOnly, addStudent);
router.get("/students", protect, adminOnly, getAllStudents);
router.put("/student/:id", protect, adminOnly, updateStudent);
router.delete("/student/:id", protect, adminOnly, deleteStudent);

//teacher management
router.post("/teacher/add", protect, adminOnly, addTeacher);
router.get("/teachers", protect, adminOnly, getTeachers);
router.put("/teacher/:id", protect, adminOnly, updateTeacher);
router.delete("/teacher/:id", protect, adminOnly, deleteTeacher);

export default router;

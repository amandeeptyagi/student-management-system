import express from "express";
import { addStudent, getStudents, updateStudent, deleteStudent, addTeacher, getTeachers, updateTeacher, deleteTeacher } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/student/add", protect, adminOnly, addStudent);
router.get("/students", protect, adminOnly, getStudents);
router.put("/student/:id", protect, adminOnly, updateStudent);
router.delete("/student/:id", protect, adminOnly, deleteStudent);

router.post("/teacher/add", protect, adminOnly, addTeacher);
router.get("/teachers", protect, adminOnly, getTeachers);
router.put("/teacher/:id", protect, adminOnly, updateTeacher);
router.delete("/teacher/:id", protect, adminOnly, deleteTeacher);

export default router;

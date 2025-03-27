import express from "express";
import { loginUser, registerAdmin, getProfile } from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;

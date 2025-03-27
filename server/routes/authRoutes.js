import express from "express";

import { 
  loginUser, 
  registerAdmin, 
  getProfile, 
  updateProfile, 
  changePassword 
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);

// Profile & Password Management Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;

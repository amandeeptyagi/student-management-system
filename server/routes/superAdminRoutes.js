import express from "express";
import {
  viewOwnProfile,
  updateOwnProfile,
  deleteOwnProfile,
  createAdmin,
  updateAdmin,
  updatePassword,
  deleteAdmin,
  getAllAdmins,
  toggleRegistration,
  toggleLogin,
  getSystemConfig,
  registerSuperAdmin,
} from "../controllers/superAdminController.js";
import { protect, superAdminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only use this once, then disable/remove it in production, or use script for registeration of superadmin
router.post("/register", registerSuperAdmin);

// All routes below are protected and only accessible by superadmin
router.use(protect, superAdminOnly);

router.get("/profile", viewOwnProfile);
router.put("/profile/update", updateOwnProfile);
router.put("/profile/change-password", updatePassword);
router.delete("/profile/delete", deleteOwnProfile);

router.post("/admin", createAdmin);
router.get("/admins", getAllAdmins);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

router.patch("/toggle-registration", toggleRegistration);
router.patch("/toggle-login", toggleLogin);
router.get("/config", protect, superAdminOnly, getSystemConfig);

export default router;

import express from "express";

import { 
  loginSuperAdmin,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login-superadmin", loginSuperAdmin);
router.post("/login", login);



export default router;

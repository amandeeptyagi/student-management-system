import express from "express";
import { checkLoginAllowed } from "../middlewares/checkSystemAccess.js";

import { 
  loginSuperAdmin,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login-superadmin", loginSuperAdmin);
router.post("/login",checkLoginAllowed, login);



export default router;

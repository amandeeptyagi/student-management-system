import generateToken from "../utils/generateToken.js";
import SuperAdmin from "../models/SuperAdminModel.js";
import Admin from "../models/AdminModel.js"
import Teacher from "../models/TeacherModel.js";
import Student from "../models/StudentModel.js";
import bcrypt from "bcryptjs";


// login superadmin
export const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ email });

    if (superAdmin && (superAdmin.password == password)) {
      const id = superAdmin._id;
      const role = "superadmin";
      const adminId = null;
      generateToken(res, id, role, adminId);

      res.json({ _id: superAdmin._id, name: superAdmin.name, email: superAdmin.email, role: superAdmin.role, admin: adminId });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = null;

    if (role === "admin") {
      user = await Admin.findOne({ email });
    }
    if (role === "teacher") {
      user = await Teacher.findOne({ email });
    }
    if (role === "student") {
      user = await Student.findOne({ email });
    }

    if (user && user.password == password) {
      const adminId = user.role === "admin" ? null : user.admin;
      generateToken(res, user._id, user.role, adminId);

      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, admin: adminId });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

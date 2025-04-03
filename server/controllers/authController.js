import generateToken from "../utils/generateToken.js";
import Admin from "../models/AdminModel.js"
import Teacher from "../models/TeacherModel.js";
import Student from "../models/StudentModel.js";
import bcrypt from "bcryptjs";


// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const user = new Admin({
      name,
      email,
      password,
      role: "admin",
    });

    await user.save();
    generateToken(res, user._id, user.role);

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = null;

    if (role==="admin") {
      user = await Admin.findOne({ email });
    }
    if (role==="teacher") {
      user = await Teacher.findOne({ email });
    }
    if (role==="student") {
      user = await Student.findOne({ email });
    }

    if (user && user.password == password) {
      generateToken(res, user._id, user.role);
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


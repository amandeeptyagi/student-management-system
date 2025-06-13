import jwt from "jsonwebtoken";
import SuperAdmin from "../models/SuperAdminModel.js";
import Admin from "../models/AdminModel.js";
import Student from "../models/StudentModel.js";
import Teacher from "../models/TeacherModel.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "superadmin") {
      req.user = await SuperAdmin.findById(decoded.id).select("-password");
      // console.log(req.user);
    }

    if(decoded.role === "admin"){
      req.user = await Admin.findById(decoded.id).select("-password");
      // console.log(req.user);
    }
    
    if(decoded.role === "teacher"){
      req.user = await Teacher.findById(decoded.id).select("-password");
      // console.log(req.user);
    }
    
    if(decoded.role === "student"){
      req.user = await Student.findById(decoded.id).select("-password");
      // console.log(req.user);
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Middleware for superadmin-only access
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Super Admins only" });
  }
};

// Middleware for admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins only" });
  }
};

// Middleware for teacher-only access
export const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Teachers only" });
  }
};

// Middleware for student-only access
export const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Students only" });
  }
};



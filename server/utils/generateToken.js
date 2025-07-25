import jwt from "jsonwebtoken";

const generateToken = (res, userId, userRole, adminId) => {
  const token = jwt.sign({ id: userId, role: userRole, admin: adminId }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production") ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;

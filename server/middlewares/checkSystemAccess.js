import Config from "../models/ConfigModel.js";

// Check if login is allowed
export const checkLoginAllowed = async (req, res, next) => {
  const config = await Config.findOne();
  if (!config || config.allowLogin) {
    return next();
  }
  return res.status(403).json({ message: "Login is currently disabled by Super Admin" });
};

// Check if admin registration is allowed
export const checkAdminRegistrationAllowed = async (req, res, next) => {
  const config = await Config.findOne();
  if (!config || config.allowAdminRegistration) {
    return next();
  }
  return res.status(403).json({ message: "Admin registration is currently disabled by Super Admin" });
};

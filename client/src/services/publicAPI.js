import API from "@/lib/axios"; // Common axios instance

// 🔐 Super Admin Login
export const loginSuperAdmin = (formData) => {
  return API.post("/auth/login-superadmin", formData);
};

// 🔐 Common User Login (Admin, Teacher, Student)
export const loginUser = (formData) => {
  return API.post("/auth/login", formData);
};


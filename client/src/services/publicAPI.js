import API from "@/lib/axios"; // Common axios instance

// 🔐 Super Admin Login
export const loginSuperAdmin = (formData) => {
  return API.post("/auth/login-superadmin", formData);
};

// 🔐 Common User Login (Admin, Teacher, Student)
// export const loginUser = (formData) => {
//   return API.post("/auth/login", formData);
// };

// 🔐 Common User Login (Admin, Teacher, Student)
export const login = async (email, password, role) => {
  const response = await API.post("/auth/login", { email, password, role });
  return response.data;
};

// ============ Admin Registration ============
export const registerAdmin = (data) =>
  API.post("/admin/register", data);

// ============ One-time Super Admin Registration (optional) ============
export const registerSuperAdmin = (data) =>
  API.post("/superadmin/register", data);
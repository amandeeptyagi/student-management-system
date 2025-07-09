import API from "@/lib/axios"; // <-- axios instance with baseURL: http://localhost:5000/api

// ============ Auth / Profile ============
export const getSuperAdminProfile = () => API.get("/superadmin/profile");

export const updateSuperAdminProfile = (data) =>
  API.put("/superadmin/profile/update", data);

export const changeSuperAdminPassword = (data) =>
  API.put("/superadmin/profile/change-password", data);

export const deleteSuperAdminAccount = () =>
  API.delete("/superadmin/profile/delete");

// ============ Admin Management ============
export const createAdmin = (data) => API.post("/superadmin/admin", data);

export const getAllAdmins = () => API.get("/superadmin/admins");

export const updateAdmin = (id, data) =>
  API.put(`/superadmin/admin/${id}`, data);

export const deleteAdmin = (id) =>
  API.delete(`/superadmin/admin/${id}`);

// ============ System Config ============
export const toggleAdminRegistration = () =>
  API.patch("/superadmin/toggle-registration");

export const toggleLoginAccess = () =>
  API.patch("/superadmin/toggle-login");

export const getSystemConfig = () =>
  API.get("/superadmin/config");


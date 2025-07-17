import API from "@/lib/axios"; // <-- Axios instance with baseURL: http://localhost:5000/api

// =================== Admin Auth/Profile ===================

// Get Admin Profile
export const getAdminProfile = () =>
  API.get("/admin/profile");

// Update Admin Profile
export const updateAdminProfile = (data) =>
  API.put("/admin/profile/update", data);

// Change Admin Password
export const changeAdminPassword = (data) =>
  API.put("/admin/profile/change-password", data);

// Delete Admin Profile
export const deleteAdminProfile = () =>
  API.delete("/admin/profile/delete");


// =================== Student Management ===================

// Add a New Student
export const addStudent = (data) =>
  API.post("/admin/student/add", data);

// Get All Students (Grouped by Course)
export const getAllStudents = () =>
  API.get("/admin/students");

// Update Student
export const updateStudent = (id, data) =>
  API.put(`/admin/student/${id}`, data);

// Delete Student
export const deleteStudent = (id) =>
  API.delete(`/admin/student/${id}`);


// =================== Teacher Management ===================

// Add a New Teacher
export const addTeacher = (data) =>
  API.post("/admin/teacher/add", data);

// Get All Teachers
export const getAllTeachers = () =>
  API.get("/admin/teachers");

// Update Teacher
export const updateTeacher = (id, data) =>
  API.put(`/admin/teacher/${id}`, data);

// Delete Teacher
export const deleteTeacher = (id) =>
  API.delete(`/admin/teacher/${id}`);

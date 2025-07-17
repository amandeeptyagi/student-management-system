import API from "@/lib/axios"; // <-- Axios instance with baseURL: http://localhost:5000/api

// =================== Course Management ===================

// Add a New Course
export const createCourse = (data) =>
  API.post("/course/add", data);

// Get All Courses
export const getAllCourses = () =>
  API.get("/course");

// Update Course
export const updateCourse = (id, data) =>
  API.put(`/course/update/${id}`, data);

// Delete Course
export const deleteCourse = (id) =>
  API.delete(`/course/delete/${id}`);

// =================== Semester Management ===================

// Get All Semesters of a Course
export const getSemesters = (courseId) =>
  API.get(`/course/${courseId}/semesters`);

// =================== Subject Management ===================

// Get Subjects of a Specific Semester
export const getSubjects = (courseId, semesterNumber) =>
  API.get(`/course/${courseId}/semesters/${semesterNumber}/subjects`);

// Add Subject to a Semester
export const addSubject = (courseId, semesterNumber, data) =>
  API.post(`/course/${courseId}/semesters/${semesterNumber}/subjects`, data);

// Update a Subject
export const updateSubject = (subjectId, data) =>
  API.put(`/course/subjects/${subjectId}`, data);

// Delete a Subject from a Semester
export const deleteSubject = (courseId, semesterNumber, subjectId) =>
  API.delete(`/course/${courseId}/semesters/${semesterNumber}/subjects/${subjectId}`);

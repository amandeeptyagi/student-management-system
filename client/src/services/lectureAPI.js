import API from "@/lib/axios"; // Axios instance with baseURL: http://localhost:5000/api

// =================== Lecture Management ===================

// Assign a new lecture
export const assignLecture = (data) =>
  API.post("/lecture/assign", data);

// Get lectures for a specific course and semester
export const getLecturesByCourseAndSemester = (courseId, semesterNumber) =>
  API.get(`/lecture/${courseId}/semesters/${semesterNumber}`);

// Get lectures for a specific teacher
export const getLecturesByTeacher = (teacherId) =>
  API.get(`/lecture/teacher/${teacherId}`);

// Update an existing lecture
export const updateLecture = (lectureId, data) =>
  API.put(`/lecture/${lectureId}`, data);

// Delete a lecture
export const deleteLecture = (lectureId) =>
  API.delete(`/lecture/${lectureId}`);

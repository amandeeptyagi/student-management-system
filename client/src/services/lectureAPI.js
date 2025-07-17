import API from "@/lib/axios"; // Axios instance with baseURL: http://localhost:5000/api

// =================== Lecture Management ===================

// Assign a new lecture
export const assignLecture = (data) =>
  API.post("/lectures/assign", data);

// Get lectures for a specific course and semester
export const getLecturesByCourseAndSemester = (courseId, semesterNumber) =>
  API.get(`/lectures/${courseId}/semesters/${semesterNumber}`);

// Update an existing lecture
export const updateLecture = (lectureId, data) =>
  API.put(`/lectures/${lectureId}`, data);

// Delete a lecture
export const deleteLecture = (lectureId) =>
  API.delete(`/lectures/${lectureId}`);

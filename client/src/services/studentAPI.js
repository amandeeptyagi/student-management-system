import API from "@/lib/axios"; // <-- axios instance with baseURL: http://localhost:5000/api

// ============ Auth / Profile ============

export const getStudentProfile = () =>
    API.get("/student/profile");

export const updateStudentPassword = (data) =>
    API.put("/student/change-password", data);

// ============ Course Details ============

export const getFullStudentCourseDetails = () =>
    API.get("/student/course-details");

//get today's schedule
export const getStudentTodaySchedule = () => 
    API.get("/student/today-classes");


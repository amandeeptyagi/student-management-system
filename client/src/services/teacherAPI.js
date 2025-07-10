import API from "@/lib/axios"; // <-- axios instance with baseURL: http://localhost:5000/api

// ============ Auth / Profile ============

// Get Teacher Profile
export const getTeacherProfile = () =>
    API.get("/teacher/profile");

// Change Password
export const updateTeacherPassword = (data) =>
    API.put("/teacher/change-password", data);

// ============ Timetable ============

// Get Teacher Timetable
export const getTeacherTimetable = () =>
    API.get("/teacher/timetable");

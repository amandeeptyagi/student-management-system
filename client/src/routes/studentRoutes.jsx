import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/lib/ProtectedRoute";
import Navbar from "@/components/Navbar";
import MainLayout from "@/layouts/MainLayout";

import StudentDashboard from "@/pages/Student/StudentDashboard";
import StudentCourses from "@/pages/Student/StudentCourses";
import StudentProfile from "@/pages/Student/StudentProfile";
import StudentAssignments from "@/pages/Student/StudentAssignments";
import StudentAttendance from "@/pages/Student/StudentAttendance";
import StudentResults from "@/pages/Student/StudentResults";

const StudentRoutes = [
    <Route element={<ProtectedRoute allowedRoles={["student"]} />} key="student">
        <Route path="/student" element={<><Navbar /><MainLayout /></>} >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="results" element={<StudentResults />} />
        </Route>
    </Route>
];

export default StudentRoutes;
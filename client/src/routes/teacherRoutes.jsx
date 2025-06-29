import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/lib/ProtectedRoute";
import Navbar from "@/components/Navbar";
import MainLayout from "@/layouts/MainLayout";

import TeacherDashboard from "@/pages/Teacher/TeacherDashboard";
import TeacherTimeTable from "@/pages/Teacher/TeacherTimeTable";
import TeacherAssignments from "@/pages/Teacher/TeacherAssignments";
import TeacherAttendance from "@/pages/Teacher/TeacherAttendance";
import TeacherResults from "@/pages/Teacher/TeacherResults";
import TeacherProfile from "@/pages/Teacher/TeacherProfile";

const TeacherRoutes = [
    <Route element={<ProtectedRoute allowedRoles={["teacher"]} />} key="teacher">
        <Route path="/teacher" element={<><Navbar /><MainLayout /></>} >
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="timetable" element={<TeacherTimeTable />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="results" element={<TeacherResults />} />
        </Route>
    </Route>
];

export default TeacherRoutes;
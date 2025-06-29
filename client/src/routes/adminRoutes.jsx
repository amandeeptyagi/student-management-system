import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/lib/ProtectedRoute";
import Navbar from "@/components/Navbar";
import MainLayout from "@/layouts/MainLayout";

import AdminProfile from "@/pages/Admin/AdminProfile";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminStudents from "@/pages/Admin/AdminStudent";
import AdminTeachers from "@/pages/Admin/AdminTeacher";
import AssignLecture from "@/pages/Admin/AssignLecture";
import AdminCourses from "@/pages/Admin/AdminCourses";

const AdminRoutes = [
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />} key="admin">
    <Route path="/admin" element={<><Navbar /><MainLayout /></>} >
      <Route path="profile" element={<AdminProfile />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="students" element={<AdminStudents />} />
      <Route path="teachers" element={<AdminTeachers />} />
      <Route path="assign-lecture" element={<AssignLecture />} />
      <Route path="courses" element={<AdminCourses />} />
    </Route>
  </Route>
];

export default AdminRoutes;

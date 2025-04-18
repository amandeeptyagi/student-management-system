import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminStudents from './Admin/AdminStudent';
import AdminTeachers from './Admin/AdminTeacher';

const AdminRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Nested routes under AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default route to redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AdminRoutes;
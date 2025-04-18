import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './TeacherLayout';
import TeacherDashboard from './Teacher/TeacherDashboard';
import TeacherTimeTable from './Teacher/TeacherTimeTable';
import TeacherAssignments from './Teacher/TeacherAssignments';
import TeacherAttendance from './Teacher/TeacherAttendance';
import TeacherResults from './Teacher/TeacherResults';

const TeacherRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/teacher" element={<TeacherLayout />}>
          {/* Add index route to redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Child routes */}
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="timetable" element={<TeacherTimeTable />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="results" element={<TeacherResults />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default TeacherRoutes;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import StudentDashboard from './StudentDashboard';
import StudentCourses from './StudentCourses';
import StudentProfile from './StudentProfile';
// Import other placeholder components
import StudentAssignments from './StudentAssignments';
import StudentAttendance from './StudentAttendance';
import StudentResults from './StudentResults';

const StudentRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/student" 
          element={<StudentLayout />}
        >
          {/* Default redirect to dashboard */}
          <Route 
            index 
            element={<Navigate to="dashboard" replace />} 
          />
          
          <Route 
            path="dashboard" 
            element={<StudentDashboard />} 
          />
          <Route 
            path="profile" 
            element={<StudentProfile />} 
          />
          <Route 
            path="courses" 
            element={<StudentCourses />} 
          />
          <Route 
            path="assignments" 
            element={<StudentAssignments />} 
          />
          <Route 
            path="attendance" 
            element={<StudentAttendance />} 
          />
          <Route 
            path="results" 
            element={<StudentResults />} 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default StudentRoutes;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import HomePage from './pages/HomePage';
import AdminSignup from './components/AdminSignup';

import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminProfile from './Admin/AdminProfile'
import AdminStudents from './Admin/AdminStudent';
import AdminTeachers from './Admin/AdminTeacher';
import AssignLecture from './Admin/AssignLecture';
import AdminCourses from './Admin/AdminCourses'

import TeacherLayout from './Teacher/TeacherLayout';
import TeacherDashboard from './Teacher/TeacherDashboard';
import TeacherTimeTable from './Teacher/TeacherTimeTable';
import TeacherAssignments from './Teacher/TeacherAssignments';
import TeacherAttendance from './Teacher/TeacherAttendance';
import TeacherResults from './Teacher/TeacherResults';
import TeacherProfile from './Teacher/TeacherProfile';

import StudentLayout from './Student/StudentLayout';
import StudentDashboard from './Student/StudentDashboard';
import StudentCourses from './Student/StudentCourses';
import StudentProfile from './Student/StudentProfile';
import StudentAssignments from './Student/StudentAssignments';
import StudentAttendance from './Student/StudentAttendance';
import StudentResults from './Student/StudentResults';

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./lib/PublicRoute";


const App = () => {
  return (
    <Router>

      <div className="flex flex-col min-h-screen">


        <Routes>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<><Navbar /><HomePage /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            {/* <Route path="/signup" element={<AdminSignup />} /> */}
          </Route>


          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<><Navbar /><AdminLayout /></>} >
              <Route path="profile" element={<AdminProfile />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="assign-lecture" element={<AssignLecture />} />
              <Route path="courses" element={<AdminCourses />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher" element={<><Navbar /><TeacherLayout /></>} >
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="timetable" element={<TeacherTimeTable />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="results" element={<TeacherResults />} />
            </Route>
          </Route>


          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<><Navbar /><StudentLayout /></>} >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="results" element={<StudentResults />} />
            </Route>
          </Route>

        </Routes>
      </div>
    </Router>
  );
};

export default App;
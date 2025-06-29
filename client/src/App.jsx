import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';

import PublicRoutes from "@/routes/publicRoutes";
import SuperAdminRoutes from '@/routes/superAdminRoutes';
import AdminRoutes from "@/routes/adminRoutes";
import TeacherRoutes from "@/routes/teacherRoutes";
import StudentRoutes from "@/routes/studentRoutes";

const App = () => {
  return (
    <Router>
      <Routes>

        {PublicRoutes}
        {SuperAdminRoutes}
        {AdminRoutes}
        {TeacherRoutes}
        {StudentRoutes}

      </Routes>
    </Router>
  );
};

export default App;
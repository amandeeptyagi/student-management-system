import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';

const TeacherLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content Area */}
      <main className="flex-grow bg-gray-100 md:ml-64 p-6 transition-all duration-300">
        {/* Render child routes here */}
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
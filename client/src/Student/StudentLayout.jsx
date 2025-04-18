import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="flex-grow bg-gray-100 md:ml-64 p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
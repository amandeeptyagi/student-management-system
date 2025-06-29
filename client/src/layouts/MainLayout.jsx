import React from 'react';
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "./AdminSidebar";
import TeacherSidebar from "./TeacherSidebar";
import StudentSidebar from "./StudentSidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";

const MainLayout = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const renderSidebar = () => {
    switch (user?.role) {
      case "admin":
        return <AdminSidebar />;
      case "teacher":
        return <TeacherSidebar />;
      case "student":
        return <StudentSidebar />;
      case "superadmin":
        return <SuperAdminSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Role-Based Sidebar */}
      {renderSidebar()}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 mt-16 bg-gray-50 overflow-hidden">
        {/* Content Container with Internal Scrolling */}
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {/* Toast Container */}
            <div className="fixed top-20 right-4 z-50">
              <Toaster position="top center" reverseOrder={false} />
            </div>

            {/* Outlet will render the child routes */}
            <Outlet />

          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
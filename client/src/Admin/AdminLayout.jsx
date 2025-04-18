import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-grow bg-gray-100 md:ml-64 p-6 transition-all duration-300">
        {/* Outlet will render the child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
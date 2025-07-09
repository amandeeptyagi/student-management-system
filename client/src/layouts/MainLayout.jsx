import React from 'react';
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from '@/components/Navbar'; 
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
   <div className="h-screen overflow-hidden flex flex-col">
     {/* Fixed Navbar */}
     {/* <Navbar /> */}

     {/* Content Area with Sidebar */}
     <div className="flex h-screen overflow-hidden">
       {/* Role-Based Sidebar */}
       {renderSidebar()}

       {/* Main Content Area */}
       <main className="flex-1 md:ml-64 mt-16 bg-gray-50 overflow-hidden">
         {/* Content Container with Internal Scrolling */}
         <div className="h-full overflow-y-auto">
           <div className="p-6">
             <Outlet />
           </div>
         </div>
       </main>
     </div>

     {/* Toast Notifications */}
     <Toaster 
       position="top-center" 
       toastOptions={{
         duration: 1000,
         reverseOrder: false
       }}
     />
   </div>
 );
};

export default MainLayout;
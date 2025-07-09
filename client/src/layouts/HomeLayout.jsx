import React from 'react';
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from '@/components/Navbar'; 

const HomeLayout = () => {
   return (
       <div className="h-screen flex flex-col overflow-hidden">
           {/* Fixed Navbar */}
           {/* <Navbar /> */}
           
           {/* Main Content Area */}
           <main className="flex-1 overflow-hidden bg-gray-50 mt-16">
               {/* Scrollable Content Container */}
               <div className="h-full overflow-y-auto">
                   <div className="min-h-full">
                       <Outlet />
                   </div>
               </div>
           </main>

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

export default HomeLayout;
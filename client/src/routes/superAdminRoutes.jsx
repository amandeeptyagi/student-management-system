import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/lib/ProtectedRoute";
import Navbar from "@/components/Navbar";
import MainLayout from "@/layouts/MainLayout";

import SuperAdminDashboard from "@/pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminProfile from "@/pages/SuperAdmin/SuperAdminProfile";
import SuperAdminAdminsList from "@/pages/SuperAdmin/SuperAdminAdminsList";
import SuperAdminConfig from "@/pages/SuperAdmin/SuperAdminConfig";

const SuperAdminRoutes = [
    <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />} key="superAdmin">
        <Route path="/superadmin" element={<><Navbar /><MainLayout /></>} >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="profile" element={<SuperAdminProfile />} />
            <Route path="admins-list" element={<SuperAdminAdminsList />} />
            <Route path="config" element={<SuperAdminConfig />} />
        </Route>
    </Route>
];

export default SuperAdminRoutes;


// import React from 'react';
// import { Route } from 'react-router-dom';
// import TempSuper from '@/pages/SuperAdmin/tempSuper';

// const SuperAdminRoutes = [
  
//     <Route path="/superadmin" element={<TempSuper />} key="superAdmin"/>
  
// ];

// export default SuperAdminRoutes;

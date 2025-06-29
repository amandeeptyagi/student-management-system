import React from "react";
import { Route } from "react-router-dom";
import PublicRoute from "@/lib/PublicRoute";
import Navbar from "@/components/Navbar";

import HomePage from "@/pages/Public/HomePage";
import Login from "@/pages/Public/Login";
import SuperAdminLogin from "@/pages/Public/SuperAdminLogin";
import SuperAdminRegister from "@/pages/Public/SuperAdminRegister";

const PublicRoutes = [
    <Route element={<PublicRoute />} key="public">
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        {/* <Route path="/admin-signup" element={<AdminSignup />} /> */}
        <Route path="/login-superadmin" element={<SuperAdminLogin />} />
        <Route path="/register-superadmin" element={<SuperAdminRegister />} />
    </Route>
];

export default PublicRoutes;
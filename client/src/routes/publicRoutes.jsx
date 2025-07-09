import React from "react";
import { Route } from "react-router-dom";
import PublicRoute from "@/lib/PublicRoute";
import Navbar from "@/components/Navbar";
import HomeLayout from "@/layouts/HomeLayout";

import HomePage from "@/pages/Public/HomePage";
import Login from "@/pages/Public/Login";
import SuperAdminLogin from "@/pages/Public/SuperAdminLogin";
import SuperAdminRegister from "@/pages/Public/SuperAdminRegister";
import AdminRegister from "@/pages/Public/AdminRegister"

const PublicRoutes = [
    <Route element={<PublicRoute />} key="public">
        <Route path="" element={<><Navbar /><HomeLayout /></>} >
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-admin" element={<AdminRegister />} />
        </Route>
        <Route path="/login-superadmin" element={<SuperAdminLogin />} />
        <Route path="/register-superadmin" element={<SuperAdminRegister />} />
    </Route>
];

export default PublicRoutes;
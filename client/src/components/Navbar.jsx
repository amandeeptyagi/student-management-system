import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user from localStorage

    const handleLogout = () => {
        localStorage.removeItem("user"); // ✅ Remove user data from localStorage
        navigate("/"); // ✅ Redirect to login page after logout
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
            {/* System Name */}
            <div
                onClick={() => handleNavigation("/")}
                className="flex-shrink-0 cursor-pointer"
            >
                <div className="text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors">
                    Student Management System
                </div>
            </div>

            {/* User Info & Authentication */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center space-x-3">
                        {/* User Info */}
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>

                        {/* User Avatar */}
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                                {user.name.charAt(0)}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigation("/login")}
                        >
                            Login
                        </Button>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleNavigation("/signup")}
                        >
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

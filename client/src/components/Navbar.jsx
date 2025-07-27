import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleNavigation = (path) => {
        setMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            {/* Top Bar */}
            <div className={`flex items-center ${user ? 'justify-end' : 'justify-between'} md:justify-between h-16 px-4 sm:px-6`}>
                {/* Mobile Menu Button */}
                {!user && (<div className="md:hidden pt-2 pl-2">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
                )}

                <div
                    onClick={() => handleNavigation("/")}
                    className="text-xl font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                    Student Management System
                </div>


                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                className="bg-white hover:bg-gray-200 text-black"
                                onClick={() => handleNavigation("/")}
                            >
                                Home
                            </Button>
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-700 text-white"
                                onClick={() => handleNavigation("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-200 hover:bg-red-400 text-black"
                                onClick={() => handleNavigation("/register-admin")}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pb-4">
                    {user ? (
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-700">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                </div>
                            </div>
                            <Button
                                onClick={handleLogout}
                                size="sm"
                                className="text-red-600 border border-red-200 hover:bg-red-50"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <Button
                                size="sm"
                                className="bg-white hover:bg-gray-200 text-black"
                                onClick={() => handleNavigation("/")}
                            >
                                Home
                            </Button>
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-700 text-white"
                                onClick={() => handleNavigation("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-200 hover:bg-red-400 text-black"
                                onClick={() => handleNavigation("/register-admin")}
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

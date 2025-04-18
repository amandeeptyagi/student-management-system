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

  return (
    <nav className="sticky top-0 z-45 flex items-center justify-between p-4 bg-blue-100 shadow-md">
      {/* System Name */}
      <Link to="/">
        <div className="text-2xl font-bold text-blue-700">
          Student Management System
        </div>
      </Link>

      {/* Authentication Buttons */}
      <div className="flex space-x-4">
        {user ? (
          // ✅ Show Logout Button when Logged In
          <Button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700">
            Logout
          </Button>
        ) : (
          // ✅ Show Login & Signup Buttons when Not Logged In
          <>
            <Link to="/login">
              <Button variant="outline" className="px-4 py-2">
                Login
              </Button>
            </Link>
            {/* <Link to="/signup">
              <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                Sign Up
              </Button>
            </Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

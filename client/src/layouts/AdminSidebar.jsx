import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Settings,
  User,
  ChevronRight,
  Users2Icon,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  },[location.pathname])

  // Navigation menu items
    const menuItems = [
      { 
        icon: <LayoutDashboard className="mr-3 h-5 w-5" />, 
        label: 'Dashboard', 
        path: '/admin/dashboard' 
      },
      { 
        icon: <User className="mr-3 h-5 w-5" />, 
        label: 'Profile', 
        path: '/admin/profile' 
      },
      { 
        icon: <Users className="mr-3 h-5 w-5" />, 
        label: 'Students', 
        path: '/admin/students' 
      },
      { 
        icon: <Users2Icon className="mr-3 h-5 w-5" />, 
        label: 'Teachers', 
        path: '/admin/teachers' 
      },
      { 
        icon: <ClipboardList className="mr-3 h-5 w-5" />, 
        label: 'Lectures', 
        path: '/admin/assign-lecture' 
      },
      { 
        icon: <BookOpen className="mr-3 h-5 w-5" />, 
        label: 'Courses', 
        path: '/admin/courses' 
      },
  
    ];

  const handleNavigation = (path) => {
    setActiveItem(path);
    setIsOpen(false); // Close mobile menu
    // console.log(`Navigate to: ${path}`);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Remove user data from localStorage
    navigate("/"); // ✅ Redirect to login page after logout
  };

  const isActive = (path) => activeItem === path;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* Logo and Title */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-100 flex-shrink-0">
          <span className="text-lg font-bold text-blue-700">
            Admin Panel
          </span>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${isActive(item.path) ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive(item.path) && (
                  <ChevronRight className="h-4 w-4 text-blue-700" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
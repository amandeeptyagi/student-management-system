import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  BarChart, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Navigation menu items
  const menuItems = [
    { 
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/student/dashboard' 
    },
    { 
      icon: <User className="mr-3 h-5 w-5" />, 
      label: 'Profile', 
      path: '/student/profile' 
    },
    { 
      icon: <BookOpen className="mr-3 h-5 w-5" />, 
      label: 'Courses', 
      path: '/student/courses' 
    },
    { 
      icon: <ClipboardList className="mr-3 h-5 w-5" />, 
      label: 'Assignments', 
      path: '/student/assignments' 
    },
    { 
      icon: <Calendar className="mr-3 h-5 w-5" />, 
      label: 'Attendance', 
      path: '/student/attendance' 
    },
    { 
      icon: <BarChart className="mr-3 h-5 w-5" />, 
      label: 'Results', 
      path: '/student/results' 
    }
  ];

  // Handle logout
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out');
    // Typically would include clearing authentication tokens, 
    // redirecting to login page, etc.
  };

  // Determine if a menu item is active
  const isActive = (path) => window.location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed top-17 left-0  h-[90vh] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 z-40 pt-0 md:pt-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Title */}
          <div className="flex items-center justify-center h-16 p-5 border-b">
            <span className="text-xl font-bold text-green-700">
              Student Portal
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow p-4">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`
                  flex items-center p-3 mb-2 rounded-lg transition-colors duration-200
                  ${isActive(item.path) 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-gray-100 text-gray-700'}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default StudentSidebar;
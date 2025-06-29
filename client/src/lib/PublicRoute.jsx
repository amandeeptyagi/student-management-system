import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user from localStorage

  if (user) {
    // ✅ Redirect based on user role
    if (user.role === "superadmin") return <Navigate to="/superadmin/dashboard" />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (user.role === "teacher") return <Navigate to="/teacher/dashboard" />;
    if (user.role === "student") return <Navigate to="/student/dashboard" />;
  }

  return <Outlet />; // ✅ Allow access to Home/Login if NOT logged in
};

export default PublicRoute;

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user"); // Get user data from storage safely
  const user = userData ? JSON.parse(userData) : null; // Parse only if data exists

  console.log(user);
  if (!user) {
    return <Navigate to="/login" />; // Redirect if not logged in
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Redirect if role is not allowed
  }

  return <Outlet />;
};

export default ProtectedRoute;

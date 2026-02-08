import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isLoggedIn, role, loading } = useAuth();

  // Wait for auth to resolve
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  //Not logged in → login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role not allowed
  if (
    allowedRoles &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/" replace />; // or /unauthorized
  }

  // Access granted
  return <Outlet />;
}

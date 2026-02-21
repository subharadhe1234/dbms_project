import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles,
  checkDepartment = false,
}) {
  const { isLoggedIn, user, loading } = useAuth();
  const { departmentId } = useParams();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  if (
    checkDepartment &&
    user.role !== "admin" &&
    String(user.departmentId) !== departmentId
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

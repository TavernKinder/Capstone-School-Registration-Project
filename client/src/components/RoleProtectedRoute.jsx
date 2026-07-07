import { Navigate, Outlet } from "react-router-dom";
import useReadAuthKeyAndRole from "../hooks/useReadAuthKeyAndRole.js";

export default function RoleProtectedRoute({ requiredRole, loginPath }) {
  const { isAuthenticated, roleMatches } = useReadAuthKeyAndRole(requiredRole);

  if (!isAuthenticated || !roleMatches) {
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
}

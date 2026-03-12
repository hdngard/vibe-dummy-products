import { useAuth } from "@/shared/auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
};

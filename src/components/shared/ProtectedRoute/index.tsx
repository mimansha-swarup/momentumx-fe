// src/routes/ProtectedLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Outlet />;
  }
  return <Navigate to={`/login`} replace state={{ from: location }} />;
};

export default ProtectedLayout;

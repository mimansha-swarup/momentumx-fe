// src/routes/ProtectedLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthCredential } from "@/hooks/useAuth";

const ProtectedLayout = () => {
  const { user, loading } = useAuthCredential();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-screen bg-background">Loading...</div>;
  } else if (user && !user?.niche && location.pathname !== "/onboarding") {
    return <Navigate to={`/onboarding`} />;
  } else if (!user) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;

// src/routes/ProtectedLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthCredential } from "@/hooks/useAuth";
import { isUserLoggedIn } from "../../../utils/index";
import RootLoader from "../Loader";

const ProtectedLayout = () => {
  const { user, loading } = useAuthCredential();
  const location = useLocation();

  const isLoggedIn = isUserLoggedIn();

  if (loading) {
    return <RootLoader />;
  } else if (user && !user?.niche && location.pathname !== "/app/onboarding") {
    return <Navigate to={`/app/onboarding`} />;
  } else if (!isLoggedIn) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;

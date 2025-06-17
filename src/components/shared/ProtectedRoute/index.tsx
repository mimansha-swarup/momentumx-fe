// src/routes/ProtectedLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthCredential } from "@/hooks/useAuth";
import { isUserLoggedIn } from "../../../utils/index";
import RootLoader from "../Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { getScriptsData } from "@/utils/feature/scripts/script.slice";
import { useEffect } from "react";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { retrieveScripts } from "@/utils/feature/scripts/script.thunk";

const ProtectedLayout = () => {
  const { user, loading } = useAuthCredential();
  const location = useLocation();

  const isLoggedIn = isUserLoggedIn();

  const titles = useAppSelector(getTitlesData);
  const scripts = useAppSelector(getScriptsData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user && user?.niche) {
      if (!titles) {
        dispatch(retrieveTitles({ isFresh: true }));
      }
      if (!scripts) {
        dispatch(retrieveScripts());
      }
    }
  }, [user]);

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

// src/routes/ProtectedLayout.jsx
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthCredential } from "@/hooks/useAuth";
import { isUserLoggedIn } from "../../../utils/index";
import RootLoader from "../Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { getScriptsData } from "@/utils/feature/scripts/script.slice";
import { useEffect, useRef } from "react";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { retrieveScripts } from "@/utils/feature/scripts/script.thunk";
import { getApiDomain } from "@/utils/network";
import RootLayout from "../rootLayout";

const ProtectedLayout = () => {
  const { user, loading } = useAuthCredential();
  const location = useLocation();

  const isLoggedIn = isUserLoggedIn();

  const titles = useAppSelector(getTitlesData);
  const scripts = useAppSelector(getScriptsData);
  const dispatch = useAppDispatch();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user && user?.niche) {
      if (!titles) {
        dispatch(retrieveTitles({ isFresh: true }));
      }
      if (!scripts) {
        dispatch(retrieveScripts());
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    const executeFn = () => {
      console.log("Executed");
      fetch(getApiDomain(true) + "/v1/health")
        .then(() => console.log("Ping sent to keep server awake"))
        .catch(console.error);
    };
    executeFn();
    intervalRef.current = setInterval(executeFn, 13 * 60 * 1000); // every 13 minutes

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) {
    return <RootLoader />;
  } else if (user && !user?.niche && location.pathname !== "/app/onboarding") {
    return <Navigate to={`/app/onboarding`} />;
  } else if (!isLoggedIn) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }

  if (location.pathname === "/app/onboarding") {
    return <Outlet />;
  }
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};

export default ProtectedLayout;

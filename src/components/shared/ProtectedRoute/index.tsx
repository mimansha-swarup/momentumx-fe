import { Outlet, Navigate, useLocation } from "react-router-dom";
import { isUserLoggedIn } from "@/utils";
import RootLoader from "@/components/shared/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { currentUser, userLoading } from "@/utils/feature/user/user.slice";
import { selectTitlesData } from "@/utils/feature/titles/titles.slice";
import { selectScriptsData } from "@/utils/feature/scripts/script.slice";
import { useEffect, useRef } from "react";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { retrieveScripts } from "@/utils/feature/scripts/script.thunk";
import { getApiDomain } from "@/utils/network";
import RootLayout from "@/components/shared/rootLayout";
import { HEALTH_CHECK_INTERVAL_MS } from "@/constants/app";
import { HIDE_OLD_FLOW } from "@/constants/root";

const ProtectedLayout = () => {
  const user = useAppSelector(currentUser);
  const loading = useAppSelector(userLoading);
  const location = useLocation();

  const isLoggedIn = isUserLoggedIn();

  const titles = useAppSelector(selectTitlesData);
  const scripts = useAppSelector(selectScriptsData);
  const dispatch = useAppDispatch();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (HIDE_OLD_FLOW) return;
    if (user && user?.isOnboardingCompleted) {
      if (!titles) {
        dispatch(retrieveTitles({ isFresh: true }));
      }
      if (!scripts) {
        dispatch(retrieveScripts());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- depends on user.uid, not the full user object (avoids re-fetch on every profile field change)
  }, [user?.uid, dispatch, titles, scripts]);

  useEffect(() => {
    const executeFn = () => {
      fetch(getApiDomain(true) + "/v1/health").catch(() => {
        // Health check failed silently
      });
    };
    executeFn();
    intervalRef.current = setInterval(executeFn, HEALTH_CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) {
    return <RootLoader />;
  } else if (user && !user?.isOnboardingCompleted && location.pathname !== "/app/onboarding") {
    return <Navigate to="/app/onboarding" />;
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

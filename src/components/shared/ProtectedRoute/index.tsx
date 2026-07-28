import { Outlet, Navigate, useLocation } from "react-router-dom";
import RootLoader from "@/components/shared/Loader";
import { useAppSelector } from "@/hooks/useRedux";
import {
  currentUser,
  userLoading,
  selectIsOnboarded,
} from "@/utils/feature/user/user.slice";
import { useEffect, useRef } from "react";
import { getApiDomain } from "@/utils/network";
import RootLayout from "@/components/shared/rootLayout";
import { HEALTH_CHECK_INTERVAL_MS } from "@/constants/app";

const ProtectedLayout = () => {
  const user = useAppSelector(currentUser);
  const loading = useAppSelector(userLoading);
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const location = useLocation();
  const onOnboarding = location.pathname === "/app/onboarding";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Only block the whole subtree during the INITIAL auth resolution (no user yet).
  // A background refetch of an already-loaded user must not unmount children —
  // otherwise a child that dispatches getUser on mount (e.g. Dashboard) loops:
  // pending → loading → unmount → fulfilled → remount → dispatch → pending …
  if (loading && !user) {
    return <RootLoader />;
  } else if (!user) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }

  // Onboarding gate: a fresh (below-minimum) user is routed to the value-first
  // onboarding before anything else. It renders fullscreen — no app sidebar.
  if (!isOnboarded) {
    return onOnboarding ? <Outlet /> : <Navigate to="/app/onboarding" replace />;
  }

  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};

export default ProtectedLayout;

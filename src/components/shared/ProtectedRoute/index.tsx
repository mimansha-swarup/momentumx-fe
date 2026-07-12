import { Outlet, Navigate, useLocation } from "react-router-dom";
import RootLoader from "@/components/shared/Loader";
import { useAppSelector } from "@/hooks/useRedux";
import { currentUser, userLoading } from "@/utils/feature/user/user.slice";
import { useEffect, useRef } from "react";
import { getApiDomain } from "@/utils/network";
import RootLayout from "@/components/shared/rootLayout";
import { HEALTH_CHECK_INTERVAL_MS } from "@/constants/app";

const ProtectedLayout = () => {
  const user = useAppSelector(currentUser);
  const loading = useAppSelector(userLoading);
  const location = useLocation();
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

  // Value-first (product doc §5.1): NO gate before first value. Below-minimum
  // users roam the dashboard + Idea door freely. The soft context minimum is
  // enforced only on entering the pipeline (ProjectPipelineLayout).
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};

export default ProtectedLayout;

import { lazy, Suspense } from "react";
import ProtectedLayout from "@/components/shared/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import ScriptDetails from "@/pages/ScriptDetails";
import ScriptPage from "@/pages/Scripts";
import TitlePage from "@/pages/Titles";
import { createBrowserRouter } from "react-router-dom";
import RootLoader from "@/components/shared/Loader";
const Onboarding = lazy(() => import("@/pages/Onboarding"));

export const localRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Landing /> },
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      {
        path: "onboarding",
        element: (
          <Suspense fallback={<RootLoader />}>
            <Onboarding />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "title",
        element: <TitlePage />,
      },
      {
        path: "scripts",
        element: <ScriptPage />,
      },
      {
        path: "script/:scriptId",
        element: <ScriptDetails />,
      },
    ],
  },
]);

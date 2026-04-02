import { lazy, Suspense } from "react";
import ProtectedLayout from "@/components/shared/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import { HIDE_OLD_FLOW } from "./root";
import RootLoader from "@/components/shared/Loader";

const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ResearchPage = lazy(() => import("@/pages/Research"));
const PackagingPage = lazy(() => import("@/pages/Packaging"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetail"));

const Profile = lazy(() => import("@/pages/Profile"));
const ScriptDetails = lazy(() => import("@/pages/ScriptDetails"));
const ScriptPage = lazy(() => import("@/pages/Scripts"));
const TitlePage = lazy(() => import("@/pages/Titles"));

export const localRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Landing /> },
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: HIDE_OLD_FLOW
      ? [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "packaging",
            element: (
              <Suspense fallback={<RootLoader />}>
                <PackagingPage />
              </Suspense>
            ),
          },
          {
            path: "research",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ResearchPage />
              </Suspense>
            ),
          },
          {
            path: "project/:projectId",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ProjectDetailPage />
              </Suspense>
            ),
          },
        ]
      : [
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
            element: (
              <Suspense fallback={<RootLoader />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "title",
            element: (
              <Suspense fallback={<RootLoader />}>
                <TitlePage />
              </Suspense>
            ),
          },
          {
            path: "scripts",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ScriptPage />
              </Suspense>
            ),
          },
          {
            path: "script/:scriptId",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ScriptDetails />
              </Suspense>
            ),
          },
          {
            path: "packaging",
            element: (
              <Suspense fallback={<RootLoader />}>
                <PackagingPage />
              </Suspense>
            ),
          },
        ],
  },
]);

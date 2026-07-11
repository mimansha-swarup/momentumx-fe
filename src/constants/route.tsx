import { lazy, Suspense } from "react";
import ProtectedLayout from "@/components/shared/ProtectedRoute";
import Landing from "@/pages/Landing";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLoader from "@/components/shared/Loader";
import { ProjectPipelineLayout, ProjectDetailRedirect } from "@/components/project";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const ResearchPage = lazy(() => import("@/pages/Research"));

// Pipeline step pages (lazy-loaded)
const ProjectScriptPage = lazy(() => import("@/pages/ProjectScript"));
const ProjectHooksPage = lazy(() => import("@/pages/ProjectHooks"));
const ProjectPackagingPage = lazy(() => import("@/pages/ProjectPackaging"));

export const localRouter = createBrowserRouter([
  { path: "/login", element: <Suspense fallback={<RootLoader />}><Login /></Suspense> },
  { path: "/", element: <Landing /> },
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<RootLoader />}>
            <Dashboard />
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
        element: <ProjectPipelineLayout />,
        errorElement: (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg text-foreground mb-4">Something went wrong loading this page.</p>
            <button
              type="button"
              onClick={() => { window.location.href = "/app/dashboard"; }}
              className="btn-primary-glow px-6 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        ),
        children: [
          {
            index: true,
            element: <ProjectDetailRedirect />,
          },
          {
            path: "script",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ProjectScriptPage />
              </Suspense>
            ),
          },
          {
            path: "hooks",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ProjectHooksPage />
              </Suspense>
            ),
          },
          {
            path: "packaging",
            element: (
              <Suspense fallback={<RootLoader />}>
                <ProjectPackagingPage />
              </Suspense>
            ),
          },
          {
            path: "*",
            element: <Navigate to="." replace />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

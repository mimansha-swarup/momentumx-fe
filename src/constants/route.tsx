import ProtectedLayout from "@/components/shared/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import { createBrowserRouter } from "react-router-dom";

export const localRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "onboarding", element: <Onboarding /> },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

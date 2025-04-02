import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/onboarding", element: <Onboarding /> },
  {
    path: "/dashboard",
    element: (
      <SidebarProvider>
        {" "}
        <Dashboard />{" "}
      </SidebarProvider>
    ),
  },
]);

function App() {
  return (
    <div className=" w-full overflow-x-hidden bg-background text-foreground ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

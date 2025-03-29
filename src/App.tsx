import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Playground from "./pages/Playground";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/playground", element: <Playground /> },
]);

function App() {
  return (
    <div className=" w-full overflow-x-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

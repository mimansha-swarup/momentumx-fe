import { RouterProvider } from "react-router-dom";
import "./App.css";

import { localRouter } from "./constants/route";
import { useAuthenticate } from "./hooks/useAuth";
import { Toaster } from "./components/ui/sonner";

function App() {
  useAuthenticate();
  return (
    <div className=" w-full bg-background text-foreground ">
      <Toaster />
      <RouterProvider router={localRouter} />
    </div>
  );
}

export default App;

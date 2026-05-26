import { RouterProvider } from "react-router-dom";
import "./App.css";

import { localRouter } from "./constants/route";
import { useAuthenticate } from "./hooks/useAuth";
import { Toaster } from "./components/ui/sonner";

function App() {
  useAuthenticate();
  return (
    <div className="w-full min-h-screen bg-background text-foreground noise-overlay">
      <Toaster />
      <RouterProvider router={localRouter} />
    </div>
  );
}

export default App;

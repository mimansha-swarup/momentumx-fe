import { RouterProvider } from "react-router-dom";

import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./hooks/useAuth";
import { localRouter } from "./constants/route";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className=" w-full overflow-x-hidden bg-background text-foreground ">
          <RouterProvider router={localRouter} />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;

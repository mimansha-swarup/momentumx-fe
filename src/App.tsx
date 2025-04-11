import { RouterProvider } from "react-router-dom";

import { SidebarProvider } from "./components/ui/sidebar";
import { localRouter } from "./constants/route";
import { useAuthenticate } from "./hooks/useAuth";

function App() {
  useAuthenticate();
  return (
    <SidebarProvider>
      <div className=" w-full overflow-x-hidden bg-background text-foreground ">
        <RouterProvider router={localRouter} />
      </div>
    </SidebarProvider>
  );
}

export default App;

// import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import SideDrawer from "../sideDrawer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    // <SidebarProvider>
    <div className="flex w-full">
      <SideDrawer />
      <main className=" flex-1 p-4">{children}</main>
    </div>
    // </SidebarProvider>
  );
};

export default RootLayout;

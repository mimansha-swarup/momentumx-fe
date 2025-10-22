import { memo, ReactNode } from "react";
import SideDrawer from "../sideDrawer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full">
      <SideDrawer />
      <main className=" flex-1 p-4">{children}</main>
    </div>
  );
};

export default memo(RootLayout);

import { memo, ReactNode } from "react";
import SideDrawer from "../sideDrawer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-orb-primary -top-40 -right-40 w-96 h-96" />
        <div className="ambient-orb-secondary top-1/2 -left-40 w-80 h-80" />
        <div className="ambient-orb-accent -bottom-20 right-1/3 w-72 h-72" />
      </div>

      <SideDrawer />
      <main className="relative flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default memo(RootLayout);

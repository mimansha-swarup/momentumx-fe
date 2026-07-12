import RootLayout from "../rootLayout";
import { LoaderCircle } from "lucide-react";

// Plain spinner for Suspense fallbacks — the route is already inside RootLayout
// (or is a bare page like /login), so this must NOT re-wrap the layout.
export const PageLoader = () => (
  <div className="flex justify-center items-center h-full min-h-[60vh]">
    <LoaderCircle className="size-12 animate-spin" />
  </div>
);

// Full app-shell loading state — used for the initial auth resolution.
const RootLoader = () => {
  return (
    <RootLayout>
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-16 animate-spin" />
      </div>
    </RootLayout>
  );
};

export default RootLoader;

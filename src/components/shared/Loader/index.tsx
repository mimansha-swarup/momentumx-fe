import RootLayout from "../rootLayout";
import { LoaderCircle } from "lucide-react";

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

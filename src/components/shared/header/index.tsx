import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const Header = ({ title }: { title: string }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="flex items-center w-full pb-14">
      <Button
        className=" block md:hidden mr-2"
        variant={"ghost"}
        onClick={toggleSidebar}
      >
        <Menu className=" size-4 " />
      </Button>
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
};

export default Header;

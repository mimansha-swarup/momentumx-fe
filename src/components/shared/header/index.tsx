import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const Header = ({ title }: { title: string }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="flex-row-gap w-full pl-4 md:pl-0 pb-10 md:pb-14">
      <h1 className="text-heading-lg">{title}</h1>
      <Button
        className="ml-auto block md:hidden text-muted-foreground hover:text-foreground transition-smooth"
        variant={"ghost"}
        onClick={toggleSidebar}
      >
        <Menu className="size-4" />
      </Button>
    </div>
  );
};

export default Header;

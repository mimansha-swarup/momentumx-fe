import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const navigateToScript = () => navigate("/app/scripts");
  return (
    <div className="flex-row-gap w-full pl-4 md:pl-0 pb-10 md:pb-14">
      {showBack && (
        <Button
          className="mr-3 !p-0 text-muted-foreground hover:text-foreground transition-smooth"
          variant={"ghost"}
          onClick={navigateToScript}
        >
          <ArrowLeft className="size-4" />
        </Button>
      )}
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

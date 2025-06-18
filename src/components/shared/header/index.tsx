import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  title,
  showBack = false,
}: {
  title: string;
  showBack: boolean;
}) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const navigateToScript = () => navigate("/app/scripts");
  return (
    <div className="flex items-center w-full pb-14">
      {showBack && (
        <Button
          className="mr-3 !p-0"
          variant={"ghost"}
          onClick={navigateToScript}
        >
          <ArrowLeft className="size-4 " />
        </Button>
      )}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Button
        className="ml-auto block md:hidden"
        variant={"ghost"}
        onClick={toggleSidebar}
      >
        <Menu className="size-4 " />
      </Button>
    </div>
  );
};

export default Header;

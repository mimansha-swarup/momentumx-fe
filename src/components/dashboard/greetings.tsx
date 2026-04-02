import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Greetings = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-between flex-wrap-reverse w-full gap-6 mb-10">
      <div>
        <h2 className="text-heading-xl mb-2">
          <span className="gradient-text">Welcome back!</span>
        </h2>
        <p className="text-label">
          Research topics and create your next video project
        </p>
      </div>

      <Button
        size={"lg"}
        className="rounded-full py-3 !px-6 ml-auto btn-primary-glow"
        onClick={() => navigate("/app/research")}
      >
        <Plus className="size-5" /> Start New Video
      </Button>
    </div>
  );
};

export default Greetings;

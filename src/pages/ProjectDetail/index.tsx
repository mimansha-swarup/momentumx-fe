import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";

const ProjectDetailPlaceholder = () => {
  const navigate = useNavigate();

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title="Project Pipeline" />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="icon-container mb-4">
          <Construction className="size-6" />
        </div>
        <h2 className="text-title text-xl mb-2">Pipeline View Coming Soon</h2>
        <p className="text-label max-w-md mb-6">
          The full project pipeline with script, hooks, and packaging steps is
          being built. Check back soon.
        </p>
        <Button
          className="btn-primary-glow"
          onClick={() => navigate("/app/dashboard")}
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailPlaceholder;

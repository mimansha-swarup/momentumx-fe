import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";

const ResearchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title="Research" />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="icon-container mb-4">
          <Search className="size-6" />
        </div>
        <h2 className="text-title text-xl mb-2">Coming Soon</h2>
        <p className="text-label max-w-md mb-6">
          Topic generation and research tools are on the way. You&apos;ll be
          able to discover trending topics, analyze competitors, and find the
          best keywords for your next video.
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

export default ResearchPage;

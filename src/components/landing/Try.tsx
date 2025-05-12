import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { brandName } from "@/constants/root";

const Try = () => {
  const navigate = useNavigate();

  const redirectToApp = () => {
    navigate("/app/dashboard");
  };
  return (
    <section className="py-16 md:py-24" id="how-it-works">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Transform Your YouTube Content?
          </h2>
          <p className="text-muted-foreground md:text-xl">
            Join thousands of creators who are saving time and growing their
            channels with {brandName}.
          </p>
          <div className="flex flex-col  mt-6">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 hover:scale-105 rounded-3xl"
              onClick={redirectToApp}
            >
              Try It Free
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Try;

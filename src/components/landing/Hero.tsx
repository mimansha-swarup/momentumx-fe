import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowDown, ChevronRight } from "lucide-react";
import { brandName } from "@/constants/root";

const Hero = () => {
  const navigate = useNavigate();

  const redirectToApp = () => {
    navigate("/app/dashboard");
  };

  const scrollToNextSection = () => {
    const ele = document.getElementById("problem-statement");
    ele?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Generate Viral YouTube Topics & Scripts in Seconds
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                AI-powered content creation tool that helps YouTubers create
                engaging videos faster than ever before.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={redirectToApp}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Try It Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToNextSection}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. Start creating in 30 seconds.
            </p>
          </div>
          <div className="relative h-[350px] rounded-xl overflow-hidden border shadow-xl flex">
            <img
              src="https://cdn.hashnode.com/res/hashnode/image/upload/v1746249283037/ee95fbe4-296a-4d1d-97cb-d64b40def19d.png"
              alt={`${brandName} Dashboard Preview`}
              className="object-cover m-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

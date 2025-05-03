import { brandName } from "@/constants/root";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

const Demo = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            See {brandName} in Action
          </h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            From idea to complete script in minutes, not hours
          </p>
        </div>
        <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border shadow-xl aspect-video">
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt={`${brandName} Demo`}
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 rounded-full h-16 w-16 p-0"
            >
              <PlayCircle className="h-8 w-8" />
              <span className="sr-only">Play demo video</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;

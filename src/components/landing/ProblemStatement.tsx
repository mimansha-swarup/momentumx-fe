import { problems } from "@/constants/root";
import GlassCard from "../shared/glassCard";

const ProblemStatement = () => {
  return (
    <section className="py-12 relative" id="problem-statement">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-200 rounded-full blur-2xl opacity-40"></div>
      </div>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center gap-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-4">
            Struggling with YouTube Content Creation?
          </h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            YouTubers spend an average of 7 hours researching topics and writing
            scripts for each video. That's time you could be spending filming,
            editing, or growing your channel.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 w-full mt-6">
            {problems?.map((problem) => (
              <GlassCard
                key={problem.heading}
                className="bg-background p-6  rounded-lg shadow-lg"
              >
                {" "}
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    {problem.heading}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {problem.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;

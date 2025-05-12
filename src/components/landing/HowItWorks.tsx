import { works } from "@/constants/root";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            Three simple steps to transform your YouTube content creation
            process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {works?.map((work) => (
            <div
              key={work.id}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <span className="text-2xl font-bold">{work.id}</span>
              </div>
              <h3 className="text-xl font-bold">{work.title}</h3>
              <p className="text-muted-foreground text-base">
                {work.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

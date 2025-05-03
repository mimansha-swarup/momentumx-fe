import Hero from "@/components/landing/Hero";
import ProblemStatement from "@/components/landing/ProblemStatement";
import HowItWorks from "@/components/landing/HowItWorks";
import Demo from "@/components/landing/Demo";
import Faq from "@/components/landing/Faq";
import Try from "@/components/landing/Try";

const Landing = () => {

  return (
    <main className="min-h-screen bg-white md:px-10">
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <Demo />
      <Faq />
      <Try />
    </main>
  );
};

export default Landing;

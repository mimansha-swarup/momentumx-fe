import { brandName, faqs } from "@/constants/root";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

const Faq = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground md:text-xl max-w-[800px]">
            Everything you need to know about {brandName}
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs?.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="hover:scale-105 transition-transform duration-200 ease-in-out"
              >
                <AccordionTrigger className="text-left text-lg  ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;

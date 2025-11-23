import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FC, useEffect, useRef, useState } from "react";
import { OnboardingCardProps } from "@/types/components/login";

const OnboardingCard: FC<OnboardingCardProps> = ({
  showNext = true,
  disablePrevious = false,
  title,
  description,
  onNext,
  onPrevious,
  children,
  isLoading,
  nextSectionCta = "Complete",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("auto");

  useEffect(() => {
    if (!contentRef.current) return;
    const newHeight = contentRef.current.scrollHeight + "px";
    setContentHeight(newHeight);
  }, [children, title, description]);
  return (
    <div className="flex flex-1 items-center justify-center p-6 transition-all ">
      <Card className="w-[34rem] gap-0">
        <CardHeader className="mb-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <div className="overflow-hidden mb-6">
          <div
            className="transition-[height] duration-500 ease-in-out"
            style={{ height: contentHeight }}
          >
            <div ref={contentRef}>
              <CardContent>{children}</CardContent>
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={disablePrevious}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button onClick={onNext}>
            {isLoading && !showNext && (
              <LoaderCircle className="animate-spin" />
            )}
            {showNext ? "Next" : nextSectionCta}
            {showNext && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingCard;

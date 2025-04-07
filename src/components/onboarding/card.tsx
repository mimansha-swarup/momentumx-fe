import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FC } from "react";
import { OnboardingCardProps } from "@/types/components/login";

const OnboardingCard: FC<OnboardingCardProps> = ({
  showNext = true,
  disablePrevious = false,
  title,
  description,
  onNext,
  onPrevious,
  children,
}) => {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}

        </CardContent>
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
            {showNext ? "Next" : "Complete"}
            {showNext && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingCard;

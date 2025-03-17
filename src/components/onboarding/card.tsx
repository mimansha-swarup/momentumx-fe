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
            {/* {currentStep === 1 && "What's your website?"}
          {currentStep === 2 && "What's your brand name?"}
          {currentStep === 3 && "What's your niche?"}
          {currentStep === 4 && "Who are your YouTube competitors?"} */}
          </CardTitle>
          <CardDescription>
            {description}
            {/* {currentStep === 1 && "Enter your website URL to get started"}
          {currentStep === 2 && "Tell us the name of your brand"}
          {currentStep === 3 && "Select the category that best describes your content"}
          {currentStep === 4 && "Add links to YouTube channels similar to yours"} */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}

          {/* <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="website">Website URL</label>
              <Input
                id="website"
                name="website"
                placeholder="https://example.com"
                // value={formData.website}
                // onChange={handleInputChange}
              />
              {/* {errors.website && <p className="text-sm text-red-500">{errors.website}</p>} 
            </div>
          </div> */}
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

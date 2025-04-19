import { StepperProps } from "@/types/components/shared";
import { Check } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils"; // assuming you have a cn() utility

const Stepper: FC<StepperProps> = ({
  orientation = "vertical", // default to vertical
  steps = [],
  activeStep,
}) => {
  return (
    <div
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-8"
      )}
    >
      {steps.map((step, stepIndex) => {
        const isStepCompleted = activeStep > stepIndex;
        const isStepReached = activeStep >= stepIndex;
        const showConnector = stepIndex !== steps.length - 1;
        const isConnectorActive = activeStep >= stepIndex + 1;

        return (
          <div
            key={step.label}
            className={cn(
              "relative flex",
              orientation === "vertical"
                ? "flex-col items-start"
                : "items-center"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0",
                  isStepCompleted
                    ? "bg-primary text-black"
                    : isStepReached
                      ? "bg-white text-black border border-black"
                      : "border border-gray-500 text-gray-500"
                )}
              >
                {isStepCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepIndex + 1
                )}
              </div>
              <span
                className={cn(
                  "ml-3 text-sm font-medium",
                  isStepCompleted ? "text-primary" : "text-white"
                )}
              >
                {step.label}
              </span>
            </div>

            {showConnector && orientation === "vertical" && (
              <div
                className={cn(
                  "ml-4 h-8 w-0.5 mt-2",
                  isConnectorActive ? "bg-primary" : "bg-gray-600"
                )}
              />
            )}

            {showConnector && orientation === "horizontal" && (
              <div
                className={cn(
                  "absolute left-full top-1/2 h-0.5 w-8",
                  isConnectorActive ? "bg-primary" : "bg-gray-600"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

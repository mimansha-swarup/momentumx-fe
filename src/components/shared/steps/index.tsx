import { StepperProps } from "@/types/components/shared";
import { Check } from "lucide-react";
import { FC } from "react";

const Stepper: FC<StepperProps> = ({
  // orientation = "horizontal",
  steps = [],
  activeStep,
}) => {
  return (
    <div>
      {steps?.map((step, stepIndex) => {
        const isStepCompleted = activeStep > stepIndex;
        const isStepReached = activeStep >= stepIndex;
        const showConnector = stepIndex !== steps.length - 1;
        const isConnectorActive = activeStep >= stepIndex + 1;
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isStepCompleted
                    ? "bg-primary text-black"
                    : isStepReached
                    ? "bg-white text-black"
                    : "border border-gray-500 text-gray-500"
                }`}
              >
                {isStepCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepIndex + 1
                )}
              </div>
              <div
                className={`ml-3 ${
                  isStepCompleted ? " text-primary" : "text-white"
                }`}
              >
                {step.label}
              </div>
            </div>
            {showConnector && (
              <div
                className={`ml-4 h-8 w-0.5 mb-2 ${
                  isConnectorActive ? "bg-primary" : "bg-gray-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

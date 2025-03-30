import { ChangeEvent, KeyboardEvent, useState } from "react";
import Stepper from "@/components/shared/steps";
import OnboardingCard from "@/components/onboarding/card";
import { onboardingConfig } from "@/constants/onboarding";
import { brandName } from "@/constants/root";
import OnboardingForm from "@/components/onboarding/form";
import { validateStep } from "@/utils/onboarding";

const INITIAL_STATE = {
  website: "",
  brandName: "",
  niche: "",
  competitors: [""],
  targetAudience: "",
  userName: "",
};

type FormKey = keyof typeof INITIAL_STATE;

const onboardingSteps = onboardingConfig.map((step) => ({
  key: step.id,
  label: step.stepLabel,
}));
const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ ...INITIAL_STATE });
  const [errors, setErrors] = useState({ ...INITIAL_STATE });

  const isPrevDisabled = currentStep === 0;
  const isNext = currentStep !== onboardingSteps.length - 1;
  const activeStep = (onboardingSteps[currentStep] || {}).key as FormKey;

  const handleInputChange =
    (fieldName: string) =>
    (e: ChangeEvent<HTMLInputElement>, index?: number) => {
      setFormData((prev) => {
        if (
          fieldName === "competitors" &&
          Number.isInteger(index) &&
          index !== undefined
        ) {
          const newCompetitors = [...prev.competitors];
          newCompetitors[index] = e.target.value;
          return { ...prev, competitors: newCompetitors };
        }
        return { ...prev, [fieldName]: e.target.value };
      });
    };

  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter") {
      handleNext();
    }
  };
  const addCompetitors = () => {
    setFormData((prev) => {
      return { ...prev, competitors: [...prev.competitors, ""] };
    });
    setErrors((prev) => {
      return { ...prev, competitors: [...prev.competitors, ""] };
    });
  };

  const removeCompetitors = (index: number) => () => {
    setFormData((prev) => {
      const newCompetitors = [...prev.competitors];
      newCompetitors.splice(index, 1);
      return { ...prev, competitors: newCompetitors };
    });
    setErrors((prev) => {
      const newErrors = [...prev.competitors];
      newErrors.splice(index, 1);
      return { ...prev, competitors: newErrors };
    });
  };

  const handleNext = () => {
    if (
      !validateStep(
        currentStep,
        formData,
        errors,
        setErrors,
        onboardingConfig[currentStep].isMandatory
      )
    )
      return;
    if (currentStep === onboardingSteps.length - 1) {
      // Complete onboarding
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden w-64 bg-black p-8 md:block">
        <div className="flex items-center text-lg font-medium text-white mb-12">
          <div className="mr-2 rounded bg-white p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-black"
            >
              <path d="M3 3h18v18H3z" />
            </svg>
          </div>
          {brandName}
        </div>

        <div className="space-y-6">
          <Stepper steps={onboardingSteps} activeStep={currentStep} />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <OnboardingCard
          onNext={handleNext}
          onPrevious={handlePrevious}
          disablePrevious={isPrevDisabled}
          showNext={isNext}
          title={onboardingConfig[currentStep].title}
          description={onboardingConfig[currentStep].description}
        >
          <OnboardingForm
            onChange={handleInputChange(activeStep)}
            value={formData[activeStep]}
            error={errors[activeStep]}
            addMultiValue={!isNext ? addCompetitors : undefined}
            removeMultiValue={removeCompetitors}
            {...onboardingConfig[currentStep]}
            onKeyPress={handleKeypress}
          />
        </OnboardingCard>
      </div>
    </div>
  );
};

export default Onboarding;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

import { KeyboardEvent, useState } from "react";
import Stepper from "@/components/shared/steps";
import OnboardingCard from "@/components/onboarding/card";
import { ONBOARDING_FORM_ID, onboardingConfig } from "@/constants/onboarding";
import { brandName, IS_NEW_USER } from "@/constants/root";
import OnboardingForm from "@/components/onboarding/form";
import { onboardingService } from "../../service/onboarding";
import { useAuthCredential } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import useUserProfile from "@/hooks/useUserProfile";
import { useAppDispatch } from "@/hooks/useRedux";
import { getUser } from "@/utils/feature/user/user.thunk";

import config from "@/constants/onboarding/config.json";
import { renderUserForm } from "@/utils/onboarding";

const onboardingSteps = onboardingConfig.map((step) => ({
  key: step.id,
  label: step.stepLabel,
}));

const onboardingServiceInstance = new onboardingService();
const Onboarding = () => {
  const { user } = useAuthCredential();
  // const [currentSection, setcurrentSection] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleInputChange,
    removeCompetitors,
    addCompetitors,
    validate,
    formData,
    errors,
  } = useUserProfile();

  const navigate = useNavigate();
  const disptach = useAppDispatch();

  const isPrevDisabled = activeQuestion === 0;
  const isNext = currentSection !== onboardingSteps.length - 1;
  const activeStep = (onboardingSteps[currentSection] || {})
    .key as `${ONBOARDING_FORM_ID}`;

  const activeSection = config.sections[currentSection];

  if (user?.niche) {
    <Navigate to="/app/dashboard" replace />;
  }

  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const handleNext = async () => {
    // if (!validate(onboardingConfig[currentSection])) return;
    if (activeQuestion === activeSection.questions.length - 1) {
      // setIsLoading(true);
      // const { purpose, ...payload } = formData;
      // payload.targetAudience = purpose[0];
      // payload.purpose = purpose[1];
      // const res = await onboardingServiceInstance.saveOnboardingData(payload);
      // if (res.success) {
      //   setTimeout(async () => {
      //     localStorage.removeItem(IS_NEW_USER);
      //     await disptach(getUser());
      //     navigate("/app/dashboard");
      //     setIsLoading(false);
      //   }, 2000);
      // }
    } else {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveQuestion((prev) => prev - 1);
  };
  const { formState, updateField, validateField } = {};
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
          <Stepper steps={onboardingSteps} activeStep={currentSection} />
        </div>
      </div>

      <div className="flex flex-col flex-1 items-center justify-center p-6">
        {/*“Business Foundation — 3 of 6 questions (50%) complete”  */}
        <h1 className="text-2xl font-bold mb-4">
          {activeSection.title} - {activeQuestion + 1} of{" "}
          {activeSection.questions.length} questions (
          {((activeQuestion + 1) / activeSection.questions.length) * 100}%
          complete)
        </h1>
        {/* import React from "react";

export function DynamicForm({ config, formHook }) {
  */}

        {/* {section.questions.map((q) => {
          const value = getValueByPath(formState, q.path);

          return renderUserForm({
            question: q,
            value,
            updateField,
            formState,
            errors,
          });
        })} */}

        <OnboardingCard
          onNext={handleNext}
          onPrevious={handlePrevious}
          disablePrevious={isPrevDisabled}
          showNext={isNext}
          title={activeSection.questions[activeQuestion].label}
          isLoading={isLoading}
        >
          {/* const value = getValueByPath(formState, q.path); */}

          {renderUserForm({
            question: activeSection.questions[activeQuestion],
            value: getValueByPath(
              formState,
              activeSection.questions[activeQuestion].path
            ),
            updateField,
            formState,
            errors,
          })}
          {/* <OnboardingForm
            onChange={handleInputChange(activeStep)}
            value={formData[activeStep]}
            error={errors[activeStep]}
            addMultiValue={!isNext ? addCompetitors : undefined}
            removeMultiValue={removeCompetitors}
            {...onboardingConfig[currentSection]}
            onKeyPress={handleKeypress}
          /> */}
        </OnboardingCard>
      </div>
    </div>
  );
};

export default Onboarding;

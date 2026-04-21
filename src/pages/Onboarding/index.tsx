

import React, { useMemo, useRef, useState } from "react";
import OnboardingCard from "@/components/onboarding/card";

import { useAppSelector } from "@/hooks/useRedux";
import { currentUser } from "@/utils/feature/user/user.slice";
import { Navigate } from "react-router-dom";
import useUserProfile from "@/hooks/useUserProfile";

import onboardingConfig from "@/constants/onboarding/config.json";
import { getValueByPath, renderUserForm } from "@/utils/onboarding";
import { getLocalStorageData, setLocalStorageData } from "@/utils/storage";
import { CURRENT_SECTION, CURRENT_QUESTION } from "@/constants/onboarding";
import { PROGRESS_GRADIENT } from "@/constants/app";
import Review from "../Review";
import Progress from "@/components/onboarding/progress";
import Sidebar from "@/components/onboarding/sidebar";
import { QuestionBase, QuestionType } from "@/types/components/onboarding";

const onboardingSteps = onboardingConfig.sections.map((step) => ({
  key: step.id,
  label: step.title,
}));

onboardingSteps.push({
  key: "review",
  label: "Review",
});

const Onboarding = () => {
  const user = useAppSelector(currentUser);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(
    getLocalStorageData(CURRENT_SECTION, 0)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    getLocalStorageData(CURRENT_QUESTION, 0)
  );
  const maxSectionIndex = useRef<number>(0);

  const { updateField, validateField, formData, errors } = useUserProfile(true);

  const activeSection = useMemo(
    () => onboardingConfig.sections[currentSectionIndex],
    [currentSectionIndex]
  );
  const activeQuestion = useMemo(
    () => activeSection.questions[currentQuestionIndex],
    [activeSection, currentQuestionIndex]
  );

  const isPrevDisabled = useMemo(
    () => currentQuestionIndex === 0 && currentSectionIndex === 0,
    [currentQuestionIndex, currentSectionIndex]
  );
  const isNext = useMemo(
    () => currentQuestionIndex !== activeSection.questions.length - 1,
    [activeSection.questions.length, currentQuestionIndex]
  );

  const percentCompleted = useMemo(
    () =>
      Math.round(
        ((currentQuestionIndex + 1) / activeSection.questions.length) * 100
      ),
    [activeSection.questions.length, currentQuestionIndex]
  );

  if (user?.isOnboardingCompleted) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleKeypress = (e: React.KeyboardEvent) => {
    // Trigger next only when pressing Ctrl + Enter
    if (e.key === "Enter" && e.ctrlKey) {
      handleNext();
    }
  };

  const handleNext = async () => {
    if (!validateField(activeQuestion as QuestionType)) return;
    if (currentQuestionIndex === activeSection.questions.length - 1) {
      if (onboardingSteps.length > currentSectionIndex) {
        setCurrentQuestionIndex(0);
        setCurrentSectionIndex((prev) => prev + 1);
        setLocalStorageData(CURRENT_QUESTION, 0);
        setLocalStorageData(CURRENT_SECTION, currentSectionIndex + 0);

        if (maxSectionIndex.current < currentSectionIndex + 1) {
          maxSectionIndex.current = currentSectionIndex + 1;
        }
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setLocalStorageData(CURRENT_QUESTION, currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0 && currentQuestionIndex === 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentQuestionIndex(
        onboardingConfig.sections[currentSectionIndex - 1].questions.length - 1
      );
      return;
    }
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const onStepperChange = (stepperIndex: number) => {
    // Add validation
    if (stepperIndex > maxSectionIndex.current) return;
    setCurrentSectionIndex(stepperIndex);
    setCurrentQuestionIndex(0);
  };

  const showReviewScreen =
    currentSectionIndex === onboardingConfig.sections.length - 1 &&
    currentQuestionIndex === activeSection.questions.length - 1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        steps={onboardingSteps}
        activeStep={maxSectionIndex.current}
        onStepperChange={onStepperChange}
      />

      <div className="flex flex-col  flex-1">
        {!showReviewScreen && (
          <Progress
            percent={percentCompleted}
            bgColor={PROGRESS_GRADIENT[currentSectionIndex]}
          />
        )}
        <div className="ml-64">
          {showReviewScreen ? (
            <div className="flex flex-col flex-1 items-center justify-center p-6 pt-0">
              <Review
                formState={formData}
                errors={errors}
                updateField={updateField}
              />
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center p-6 pt-0">
              <div className="w-full mb-4 ">
                <h1 className="text-2xl font-bold ">
                  {activeSection.title} - {currentQuestionIndex + 1} of{" "}
                  {activeSection.questions.length} questions ({percentCompleted}
                  % complete)
                </h1>
                <p className="text-lg text-gray-500">
                  {activeSection.subtitle}
                </p>
              </div>
              <OnboardingCard
                onNext={handleNext}
                onPrevious={handlePrevious}
                disablePrevious={isPrevDisabled}
                showNext={isNext}
                title={activeQuestion.title}
                nextSectionCta={activeSection.ctaButton}
              >
                {renderUserForm({
                  question: activeQuestion as QuestionBase,
                  value: getValueByPath(formData, activeQuestion.path),
                  updateField,
                  formState: formData,
                  errors,
                  onEnter: handleKeypress,
                })}
              </OnboardingCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

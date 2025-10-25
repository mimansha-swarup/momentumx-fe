import { ONBOARDING_FORM_ID } from "@/constants/onboarding";
import { OnboardingConfigType } from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { validateStep } from "@/utils/onboarding";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

const INITIAL_STATE = {
  website: "",
  niche: "",
  competitors: [""],
  // targetAudience: "",
  userName: "",
  purpose: ["", ""],
};

const getInitialState = (user: IUserProfile | null) => ({
  website: user?.website || "",
  niche: user?.niche || "",
  competitors: user?.competitors?.map((url) => url.url) || [""],
  // targetAudience: user?.targetAudience || "",
  userName: user?.userName || "",
  purpose: user?.userName ? [user?.purpose, user?.targetAudience] : ["", ""],
});

export type errorStateType = ReturnType<typeof getInitialState>;
export const useUserProfile = (preFilledState?: IUserProfile | null) => {
  const [formData, setFormData] = useState({ ...INITIAL_STATE });
  const [errors, setErrors] = useState({ ...INITIAL_STATE });

  useEffect(() => {
    if (preFilledState) setFormData(getInitialState(preFilledState));
  }, [preFilledState]);

  const handleInputChange =
    (fieldName: string) =>
    (e: ChangeEvent<HTMLInputElement>, index?: number) => {
      setFormData((prev) => {
        if (
          fieldName === ONBOARDING_FORM_ID.COMPETITORS &&
          Number.isInteger(index) &&
          index !== undefined
        ) {
          const newCompetitors = [...prev.competitors];
          newCompetitors[index] = e.target.value;
          return { ...prev, competitors: newCompetitors };
        }

        if (
          fieldName === ONBOARDING_FORM_ID.CHANNEL_PURPOSE &&
          Number.isInteger(index) &&
          index !== undefined
        ) {
          const purposeArr = [...prev.purpose];
          purposeArr[index] = e.target.value;
          return { ...prev, purpose: purposeArr };
        }
        return { ...prev, [fieldName]: e.target.value };
      });
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

  const validate = useCallback(
    (userData: OnboardingConfigType | OnboardingConfigType[]) =>
      validateStep(userData, formData, errors, setErrors),
    [formData, errors]
  );

  return {
    handleInputChange,
    removeCompetitors,
    addCompetitors,
    validate,
    formData,
    errors,
  };
};

export default useUserProfile;

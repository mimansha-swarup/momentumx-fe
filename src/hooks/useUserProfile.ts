import { OnboardingConfigType } from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { validateStep } from "@/utils/onboarding";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

const INITIAL_STATE = {
  website: "",
  niche: "",
  competitors: [""],
  targetAudience: "",
  userName: "",
};

const getInitialState = (user: IUserProfile | null) => ({
  website: user?.website || "",
  niche: user?.niche || "",
  competitors: user?.competitors || [""],
  targetAudience: user?.targetAudience || "",
  userName: user?.userName || "",
});

export type  errorStateType= ReturnType<typeof getInitialState>;
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

  console.log("FormData", formData);
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

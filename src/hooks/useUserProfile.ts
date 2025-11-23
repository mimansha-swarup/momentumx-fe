import { INITIAL_ONBOARDING_STATE, ONBOARDING_FORM } from "@/constants/onboarding";
import {
  IOnboardingPayload,
  QuestionType,
} from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { getValueByPath } from "@/utils/onboarding";
import { useEffect, useState } from "react";

export const useUserProfile = (
  saveFormData = false,
  preFilledState?: IUserProfile | null
) => {
  const [errors, setErrors] = useState(INITIAL_ONBOARDING_STATE);
  const [formData, setFormData] = useState<IOnboardingPayload>(() => {
    if (!saveFormData) return preFilledState || INITIAL_ONBOARDING_STATE;
    try {
      const saved = localStorage.getItem(ONBOARDING_FORM);
      return saved ? JSON.parse(saved) : INITIAL_ONBOARDING_STATE;
    } catch {
      return INITIAL_ONBOARDING_STATE;
    }
  });

  useEffect(() => {
    if (!saveFormData) return;
    localStorage.setItem(ONBOARDING_FORM, JSON.stringify(formData));
  }, [formData]);

  const updateField = (path: string, value: unknown) => {
    setFormData((prev) => {
      const newState = structuredClone(prev);

      // Convert "a.b[0].c" → ["a", "b", 0, "c"]
      const parts = path
        .replace(/\[(\d+)\]/g, ".$1") // Convert [0] → .0
        .split(".")
        .map((part) => (isNaN(Number(part)) ? part : Number(part)));

      let current: IOnboardingPayload = newState;

      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const nextKey = parts[i + 1];

        if (current[key] == null) {
          current[key] = typeof nextKey === "number" ? [] : {};
        }

        current = current[key];
      }

      const finalKey = parts[parts.length - 1];
      current[finalKey] = value;

      return newState;
    });
  };
  const validateQuestion = (question: QuestionType): boolean => {
    let isValid = true;

    const validateSimpleField = (
      q: QuestionType,
      realPath?: string
    ): boolean => {
      const path = realPath || q.path;
      const value = getValueByPath(formData, path);

      let error = "";

      if (
        q.required &&
        (value === "" ||
          value === null ||
          value === undefined ||
          value?.length === 0)
      ) {
        error = "This field is required.";
      } else if (q.minLength && value?.length < q.minLength) {
        error = `Minimum ${q.minLength} characters required.`;
      } else if (q.maxLength && value?.length > q.maxLength) {
        error = `Maximum ${q.maxLength} characters allowed.`;
      } else if (q.validation?.pattern) {
        const regex = new RegExp(q.validation.pattern);
        if (!regex.test(value)) error = "Invalid format.";
      }

      setErrors((prev: any) => ({ ...prev, [path]: error }));
      return !error;
    };

    const validateGroup = (q: QuestionType): boolean => {
      let ok = true;
      const rows = getValueByPath(formData, q.path) || [];

      console.log("rowss", rows);

      rows.forEach((row: any, i: number) => {
        q.groupFields.forEach((field: any) => {
          const fullPath = `${q.path}[${i}].${field.path}`;
          const valid = validateSimpleField(field, fullPath);
          if (!valid) ok = false;
        });
      });

      return ok;
    };

    const validateConditional = (q: QuestionType): boolean => {
      if (!q.conditional) return true;

      const value = getValueByPath(formData, q.path);
      const conditions = Array.isArray(q.conditional)
        ? q.conditional
        : [q.conditional];

      let ok = true;

      conditions.forEach((cond) => {
        const triggers = Array.isArray(cond.triggerValue)
          ? cond.triggerValue
          : [cond.triggerValue];

        const shouldShow =
          q.type === "checkbox"
            ? value?.some((v: string) => triggers.includes(v))
            : triggers.includes(value);

        if (shouldShow) {
          cond.fields.forEach((field: any) => {
            const fieldPath = field.path || q.path;
            const valid = validateSimpleField(field, fieldPath);
            if (!valid) ok = false;
          });
        }
      });

      return ok;
    };

    if (question.type === "group") {
      // validate each row × each subfield
      if (!validateGroup(question)) isValid = false;
    } else {
      // simple field
      if (!validateSimpleField(question)) isValid = false;
    }

    // conditional checks
    if (!validateConditional(question)) isValid = false;

    return isValid;
  };

  return {
    updateField,
    validateField: validateQuestion,
    formData,
    errors,
  };
};

export default useUserProfile;

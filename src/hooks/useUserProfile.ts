

import {
  INITIAL_ONBOARDING_STATE,
  ONBOARDING_FORM,
} from "@/constants/onboarding";
import {
  IOnboardingPayload,
  GroupQuestion,
  ConditionalRule,
  DeepNest,
  StandardConditional,
  QuestionType,
} from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { getValueByPath } from "@/utils/onboarding";
import { useEffect, useState } from "react";

export const useUserProfile = (
  saveFormData = false,
  preFilledState?: IUserProfile | null
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<IOnboardingPayload>(() => {
    if (!saveFormData) return preFilledState || INITIAL_ONBOARDING_STATE;
    try {
      const saved = localStorage.getItem(ONBOARDING_FORM);
      return saved
        ? (JSON.parse(saved) satisfies DeepNest)
        : INITIAL_ONBOARDING_STATE;
    } catch {
      return INITIAL_ONBOARDING_STATE;
    }
  });

  useEffect(() => {
    if (saveFormData) {
      localStorage.setItem(ONBOARDING_FORM, JSON.stringify(formData));
    }
  }, [formData]);

  // ===========================
  //   UPDATE FIELD SAFE TYPING
  // ===========================
  const updateField = (path: string, value: unknown) => {
    setFormData((prev) => {
      const newState = structuredClone(prev);

      const parts = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .map((part) => (isNaN(Number(part)) ? part : Number(part)));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic path traversal requires runtime flexibility
      let current: Record<string | number, any> = newState as Record<string | number, any>;

      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const nextKey = parts[i + 1];

        if (current[key] == null) {
          current[key] = typeof nextKey === "number" ? [] : {};
        }
        current = current[key];
      }

      current[parts[parts.length - 1]] = value;
      return newState;
    });
  };

  // ===========================
  //      VALIDATION LOGIC
  // ===========================
  const validateQuestion = (question: QuestionType): boolean => {
    let valid = true;

    const validateSimpleField = (
      q: QuestionType,
      overridePath?: string
    ): boolean => {
      const path: string = overridePath || q.path || "";
      const value = getValueByPath(
        formData as unknown as DeepNest,
        path
      ) as string;
      let error = "";

      if (q.required && (!value || value.length === 0)) {
        error = "This field is required.";
      } else if (q.minLength && value?.length < q.minLength) {
        error = `Minimum ${q.minLength} characters required.`;
      } else if (q.maxLength && value?.length > q.maxLength) {
        error = `Maximum ${q.maxLength} characters allowed.`;
      } else if (q.validation?.pattern) {
        const regex = new RegExp(q.validation.pattern);
        if (!regex.test(value)) {
          error = "Invalid format.";
        }
      }

      setErrors((prev) => ({ ...prev, [path]: error }));
      return !error;
    };

    const validateGroup = (q: GroupQuestion): boolean => {
      let ok = true;
      const rows= getValueByPath(formData, `${q.path}`) as [] || [];

      rows.forEach((_: unknown, idx: number) => {
        q.groupFields.forEach((field) => {
          const fullPath = `${q.path}[${idx}].${field.path}`;
          const fieldValid = validateSimpleField(field as unknown as QuestionType, fullPath);
          if (!fieldValid) ok = false;
        });
      });

      return ok;
    };

    const validateConditional = (q: QuestionType): boolean => {
      let conds: (ConditionalRule | StandardConditional)[] = [];

      if (q.conditional) {
        conds = q.conditional
          ? Array.isArray(q.conditional)
            ? q.conditional
            : [q.conditional]
          : [];
      }

      let ok = true;
      const fieldValue = getValueByPath(formData, `${q.path}`) as string;

      conds.forEach((cond: ConditionalRule | StandardConditional) => {
        const triggers = Array.isArray(cond.triggerValue)
          ? cond.triggerValue
          : [cond.triggerValue];

        const show =
          q.type === "checkbox"
            ? (fieldValue as unknown as string[])?.some((v: string) =>
                triggers.includes(v)
              )
            : triggers.includes(fieldValue);

        if (show) {
          cond.fields.forEach((cf) => {
            const path = cf.path ?? "";
            const fieldOk = validateSimpleField(cf as QuestionType, path);
            if (!fieldOk) ok = false;
          });
        }
      });

      return ok;
    };

    if (question.type === "group") {
      if (!validateGroup(question)) valid = false;
    } else {
      if (!validateSimpleField(question)) valid = false;
    }

    if (!validateConditional(question)) valid = false;

    return valid;
  };

  return {
    updateField,
    validateField: validateQuestion,
    formData,
    errors,
  };
};

export default useUserProfile;

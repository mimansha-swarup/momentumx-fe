import { ONBOARDING_FORM_ID } from "@/constants/onboarding";
import { getValueByPath } from "@/pages/Onboarding";
import {
  OnboardingConfigType,
  QuestionType,
} from "@/types/components/onboarding";
import { IUserProfile } from "@/types/feature/user";
import { validateStep } from "@/utils/onboarding";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

export const INITIAL_ONBOARDING_STATE = {
  business: {
    type: "",
    type_other: "",
    offering: "",
    price_point: "",
    recurring_value: "",
    monthly_revenue: "",
    primary_goal: "",
    current_channels: [],
  },

  avatar: {
    definition: "",
    pain_point: "",
    aspiration: "",
    failed_attempts: [],
    false_belief: "",
    online_presence: [],
    burning_questions: [],
  },

  positioning: {
    unique_method: "",
    enemy: "",
    credibility: "",
    one_liner: "",
    competitors: [{ channel: "", doWell: "", missing: "" }],
    winning_content: "",
  },

  production: {
    time_commitment: "",
    experience_level: "",
    preferred_formats: [],
    tone: "",
    team_size: "",
    team_details: "",
    target_cadence: "",
    preferred_days: [],
    preferred_time: "",
    timezone: "",
  },

  assets: {
    existing: [],
    youtube_status: "",
    youtube_url: "",
    email_subscribers: "",
    brand_status: "",
    brand_files: "",
  },

  cta: {
    primary_type: "",
    primary_url: "",
    primary_description: "",
    copy: "",
  },

  integrations: {
    requested: [],
  },

  meta: {
    onboarding_completed: false,
    strategy_generated: false,
    first_ideas_generated: false,
    first_video_scripted: false,
    first_video_published: false,
  },
};

export const useUserProfile = (preFilledState?: IUserProfile | null) => {
  const [formData, setFormData] = useState(INITIAL_ONBOARDING_STATE);
  console.log("formData", formData);
  const [errors, setErrors] = useState(INITIAL_ONBOARDING_STATE);

  function updateField(path: string, value: unknown) {
    setFormData((prev) => {
      const keys = path.split(".");
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  }

  const validateField = (question: QuestionType) => {
    const value = getValueByPath(formData, question.path);
    const rules = question;
    let error = "";

    if (rules.required && (value === "" || value?.length === 0)) {
      error = "This field is required.";
    } else if (rules.minLength && value?.length < rules.minLength) {
      error = `Minimum ${rules.minLength} characters required.`;
    } else if (rules.maxLength && value?.length > rules.maxLength) {
      error = `Maximum ${rules.maxLength} characters allowed.`;
    } else if (question.type === "text" && question?.validation?.pattern) {
      const pattern = new RegExp(question?.validation.pattern);
      if (!pattern.test(value)) error = "Invalid format.";
    }
    console.log("error", error);
    setErrors((prev) => ({ ...prev, [question.id]: error }));
    return error === "";
  };

  return {
    updateField,
    validateField,
    formData,
    errors,
  };
};

export default useUserProfile;

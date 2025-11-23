import onboardingConfig from "@/constants/onboarding/config.json";
import { INITIAL_ONBOARDING_STATE } from "../../constants/onboarding/index";

export type SectionType = (typeof onboardingConfig.sections)[number];
export type QuestionType =
  (typeof onboardingConfig.sections)[number]["questions"];

export type IOnboardingPayload = typeof INITIAL_ONBOARDING_STATE;

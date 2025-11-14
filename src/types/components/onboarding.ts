import onboardingConfig from "@/constants/onboarding/config.json";

export type SectionType = (typeof onboardingConfig.sections)[number];
export type QuestionType =
  (typeof onboardingConfig.sections)[number]["questions"];

export interface IOnboardingPayload {
  website: string;
  niche: string;
  competitors: string[];
  purpose: string[];
  userName: string;
}

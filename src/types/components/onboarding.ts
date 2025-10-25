import { onboardingConfig } from "../../constants/onboarding/index";
export type OnboardingConfigType = (typeof onboardingConfig)[number];

export interface IOnboardingPayload {
  website: string;
  niche: string;
  competitors: string[];
  purpose: string[];
  userName: string;
}

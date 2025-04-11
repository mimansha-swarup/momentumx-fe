import { onboardingConfig } from "../../constants/onboarding/index";
export type OnboardingConfigType = (typeof onboardingConfig)[0];

export interface IOnboardingPayload {
  website: string;
  brandName: string;
  niche: string;
  competitors: string[];
  targetAudience: string;
  userName: string;
}

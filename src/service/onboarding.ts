import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  IUserProfile,
  IProfileInput,
  IPrefillResponse,
} from "@/types/feature/user";

const URLS = {
  profile: "/v1/user/profile",
  onboarding: "/v1/user/onboarding",
  prefill: "/v1/user/onboarding/prefill",
  refreshContext: "/v1/user/refresh-context",
};

class OnboardingService {
  async getUserRecord(): Promise<IBaseFetchResponse<IUserProfile>> {
    const response = await baseFetch.get(URLS.profile);
    return response.data;
  }

  // Infer {niche, targetAudience, brandName} from a channel URL (not persisted).
  async prefill(
    channelUrl: string
  ): Promise<IBaseFetchResponse<IPrefillResponse>> {
    const response = await baseFetch.post(URLS.prefill, { channelUrl });
    return response.data;
  }

  // Complete brand setup — required minimum is channel URL OR niche+targetAudience.
  async completeOnboarding(
    payload: IProfileInput
  ): Promise<IBaseFetchResponse<{ payload: IUserProfile }>> {
    const response = await baseFetch.patch(URLS.onboarding, payload);
    return response.data;
  }

  async updateProfile(
    payload: IProfileInput
  ): Promise<IBaseFetchResponse<{ payload: IUserProfile }>> {
    const response = await baseFetch.patch(URLS.profile, payload);
    return response.data;
  }

  // Re-pull channel/website enrichment from the stored inputs (no body).
  async refreshContext(): Promise<IBaseFetchResponse<IUserProfile>> {
    const response = await baseFetch.post(URLS.refreshContext);
    return response.data;
  }
}

export const onboardingService = new OnboardingService();

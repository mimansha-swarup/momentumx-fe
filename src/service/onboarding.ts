import { IOnboardingPayload } from "@/types/components/onboarding";
import { baseFetch } from "@/utils/network";
import { handleToast } from "@/utils/toast";

const URLS = {
  SAVE_FORM: "/v1/user/onboarding",
  PROFILE: "/v1/user/profile",
};

interface IOnboardingApiPayload {
  userName: string;
  brandName: string;
  niche: string;
  purpose: string;
  targetAudience: string;
  competitors: string[];
  description: string;
  website?: string;
}

class OnboardingService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  private transformPayload(payload: IOnboardingPayload): IOnboardingApiPayload {
    const niche =
      payload.business?.type === "other"
        ? payload.business?.type_other
        : payload.business?.type || "";

    const website = payload.cta?.primary_url || undefined;

    return {
      userName: payload.assets?.youtube_url || "",
      brandName: payload.business?.offering || "",
      niche: niche || "",
      purpose: payload.business?.primary_goal || "",
      targetAudience: payload.avatar?.definition || "",
      competitors:
        payload.positioning?.competitors
          ?.map((c) => c.channel)
          .filter(Boolean) || [],
      description: payload.positioning?.one_liner || "",
      ...(website ? { website } : {}),
    };
  }

  async getUserRecord() {
    const response = await baseFetch.get(this.urls.PROFILE);
    return response?.data;
  }

  async saveOnboardingData(payload: IOnboardingPayload) {
    const transformed = this.transformPayload(payload);
    const response = await baseFetch.patch(this.urls.SAVE_FORM, transformed);
    handleToast(response.data);
    return response.data;
  }

  async updateProfile(payload: IOnboardingPayload) {
    const transformed = this.transformPayload(payload);
    const response = await baseFetch.patch(this.urls.PROFILE, transformed);
    handleToast(response.data);
    return response.data;
  }
}

export const onboardingService = new OnboardingService();

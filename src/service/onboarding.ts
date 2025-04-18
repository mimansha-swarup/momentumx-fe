import { IOnboardingPayload } from "@/types/components/onboarding";
import { baseFetch } from "@/utils/network";

const URLS = {
  SAVE_FORM: "/v1/user/onboarding",
  PROFILE: "/v1/user/profile",
};
export class onboardingService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  async getUserRecord() {
    try {
      const response = await baseFetch.get(this.urls.PROFILE);

      return response?.data;
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
      throw error;
    }
  }
  async saveOnboardingData(payload: IOnboardingPayload) {
    try {
      const response = await baseFetch.patch(this.urls.SAVE_FORM, payload);
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
      throw error;
    }
  }
}

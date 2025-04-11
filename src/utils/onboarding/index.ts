import { ONBOARDING_FORM_ID } from "@/constants/onboarding";
import { OnboardingForm } from "@/types/components/login";
import { OnboardingConfigType } from "@/types/components/onboarding";

export const validateStep = (
  currentStep: OnboardingConfigType,
  formData: OnboardingForm,
  errors: OnboardingForm,
  setErrors: (errors: OnboardingForm) => void
) => {
  const { isMandatory } = currentStep;
  if (!isMandatory) return true;
  const newErrors = { ...errors };
  let isValid = true;

  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[a-zA-Z0-9@\-_]+/;

  switch (currentStep.id) {
    case ONBOARDING_FORM_ID.USER_NAME:
      newErrors.userName = !formData.userName ? "User name is required" : "";
      isValid = !newErrors.userName;
      break;
    case ONBOARDING_FORM_ID.BRAND_NAME:
      newErrors.brandName = !formData.brandName ? "Brand name is required" : "";
      isValid = !newErrors.brandName;
      break;

    case ONBOARDING_FORM_ID.TARGET_AUDIENCE:
      newErrors.targetAudience = !formData.targetAudience
        ? "Target Audience is required"
        : "";
      isValid = !newErrors.targetAudience;
      break;
    case ONBOARDING_FORM_ID.WEBSITE:
      newErrors.website = !formData.website
        ? "Website URL is required"
        : !urlRegex.test(formData.website)
        ? "Please enter a valid website URL"
        : "";
      isValid = !newErrors.website;
      break;

    case ONBOARDING_FORM_ID.NICHE:
      newErrors.niche = !formData.niche ? "Please select a niche" : "";
      isValid = !newErrors.niche;
      break;

    case ONBOARDING_FORM_ID.COMPETITORS:
      newErrors.competitors = formData.competitors.map((competitor) =>
        !competitor
          ? ((isValid = false), "Competitor URL is required")
          : !youtubeRegex.test(competitor)
          ? ((isValid = false), "Please enter a valid YouTube URL")
          : ""
      );
      break;

    default:
      break;
  }

  setErrors(newErrors);
  return isValid;
};

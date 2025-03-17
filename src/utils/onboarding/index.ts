import { OnboardingForm } from "@/types/components/login";

export const validateStep = (
  currentStep: number,
  formData: OnboardingForm,
  errors: OnboardingForm,
  setErrors: (errors: OnboardingForm) => void
) => {
  const newErrors = { ...errors };
  let isValid = true;

  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[a-zA-Z0-9@\-_]+/;

  switch (currentStep) {
    case 0:
      newErrors.brandName = !formData.brandName ? "Brand name is required" : "";
      isValid = !newErrors.brandName;
      break;

    case 1:
      newErrors.website = !formData.website
        ? "Website URL is required"
        : !urlRegex.test(formData.website)
        ? "Please enter a valid website URL"
        : "";
      isValid = !newErrors.website;
      break;

    case 2:
      newErrors.niche = !formData.niche ? "Please select a niche" : "";
      isValid = !newErrors.niche;
      break;

    case 3:
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
  console.log("isValid: ", isValid);
  return isValid;
};

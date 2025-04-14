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
  console.log("currentStep: ", currentStep);
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

  console.log("newErrors: ", newErrors, isValid);
  setErrors(newErrors);
  return isValid;
};

export const generateRandomScript = (title: string) => {
  const introductions = [
    `Welcome to this comprehensive guide on ${title}.`,
    `Today, we're diving deep into ${title}.`,
    `In this script, we'll explore everything about ${title}.`,
  ];

  const mainPoints = [
    `First, let's understand the key concepts of ${title}.`,
    `The history of ${title} is fascinating and worth exploring.`,
    `Let's analyze the impact of ${title} on modern society.`,
    `What are the practical applications of ${title}?`,
    `Many experts consider ${title} to be a groundbreaking concept.`,
    `The future implications of ${title} are vast and exciting.`,
  ];

  const conclusions = [
    `In conclusion, ${title} represents a significant area of study.`,
    `To summarize, the importance of ${title} cannot be overstated.`,
    `As we've seen, ${title} continues to shape our understanding of this field.`,
  ];

  const introduction =
    introductions[Math.floor(Math.random() * introductions.length)];

  let content = "";
  const numPoints = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numPoints; i++) {
    const point = mainPoints[Math.floor(Math.random() * mainPoints.length)];
    content += `\n\n${point}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;
  }

  const conclusion =
    conclusions[Math.floor(Math.random() * conclusions.length)];

  return `${introduction}${content}\n\n${conclusion}`;
};

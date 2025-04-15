import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ONBOARDING_FORM_ID } from "@/constants/onboarding";
import { IOnboardingFormProps, OnboardingForm } from "@/types/components/login";
import { OnboardingConfigType } from "@/types/components/onboarding";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const validateStep = (
  currentStep: OnboardingConfigType | OnboardingConfigType[],
  formData: OnboardingForm,
  errors: OnboardingForm,
  setErrors: (errors: OnboardingForm) => void
) => {
  const steps = Array.isArray(currentStep) ? currentStep : [currentStep];
  const newErrors = { ...errors };
  let isValid = true;

  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[a-zA-Z0-9@\-_]+/;

  steps.forEach((step) => {
    const { isMandatory, id } = step;
    if (!isMandatory) return;

    switch (id) {
      case ONBOARDING_FORM_ID.USER_NAME:
        newErrors.userName = !formData.userName ? "User name is required" : "";
        if (newErrors.userName) isValid = false;
        break;

      case ONBOARDING_FORM_ID.BRAND_NAME:
        newErrors.brandName = !formData.brandName
          ? "Brand name is required"
          : "";
        if (newErrors.brandName) isValid = false;
        break;

      case ONBOARDING_FORM_ID.TARGET_AUDIENCE:
        newErrors.targetAudience = !formData.targetAudience
          ? "Target Audience is required"
          : "";
        if (newErrors.targetAudience) isValid = false;
        break;

      case ONBOARDING_FORM_ID.WEBSITE:
        newErrors.website = !formData.website
          ? "Website URL is required"
          : !urlRegex.test(formData.website)
            ? "Please enter a valid website URL"
            : "";
        if (newErrors.website) isValid = false;
        break;

      case ONBOARDING_FORM_ID.NICHE:
        newErrors.niche = !formData.niche ? "Please select a niche" : "";
        if (newErrors.niche) isValid = false;
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
  });

  console.log("newErrors: ", newErrors);
  setErrors(newErrors);
  return isValid;
};

export const renderUserForm = ({
  inputType,
  placeholder,
  label,
  id,
  value,
  error,
  onChange,
  removeMultiValue,
  onKeyPress = () => null,
  className = "",
}: IOnboardingFormProps) => {
  switch (inputType) {
    case "multi-text":
      if (!Array.isArray(value)) {
        return <></>;
      }
      return value?.map((multiValue, index) => {
        return (
          <div key={index} className="flex items-start space-x-2">
            <div className="flex-1 space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`competitor-${index}`}>
                  {index === 0
                    ? "YouTube Competitor"
                    : `YouTube Competitor ${index + 1}`}
                </Label>
                {value.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={removeMultiValue?.(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <Input
                id={`competitor-${index}`}
                placeholder={placeholder}
                value={multiValue}
                onChange={(e) => onChange(e, index)}
                className="mt-4"
              />
              {error[index] && (
                <p className="text-sm text-red-500">{error[index]}</p>
              )}
            </div>
          </div>
        );
      });
    case "text":
    default:
      return (
        <div className={cn("space-y-2", className)}>
          <Label htmlFor={id}>{label}</Label>
          <Input
            className="mt-4"
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyPress}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
  }
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

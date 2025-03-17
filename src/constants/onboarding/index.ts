import { brandName } from "../root";

export const onboardingSteps = [
  {
    key: "brandName",
    label: "Brand",
  },
  {
    key: "website",
    label: "Website",
  },
  {
    key: "niche",
    label: "Niche",
  },
  {
    key: "competitors",
    label: "Competitors",
  },
];

export const onboardingConfig = [
  {
    title: "What's your brand name?",
    description: "Tell us the name of your brand",
    id: "brand",
    label: "Brand Name",
    placeholder: brandName,
    inputType: "text",
  },
  {
    title: "What's your website?",
    description: "Enter your website URL to get started",
    id: "website",
    label: "Website URL",
    placeholder: "https://example.com",
    inputType: "text",
  },
  {
    title: "What's your niche?",
    description: "Select the category that best describes your content",
    id: "niche",
    label: "Your Niche",
    placeholder: "Enter a niche",
    inputType: "text",
  },
  {
    title: "Who are your YouTube competitors?",
    description: "Add links to YouTube channels similar to yours",
    id: "competitors",
    label: "YouTube Competitor",
    placeholder: "https://youtube.com/channel/...",
    inputType: "multi-text",
  },
];

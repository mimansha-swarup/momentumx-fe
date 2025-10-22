export const enum ONBOARDING_FORM_ID {
  USER_NAME = "userName",
  TARGET_AUDIENCE = "targetAudience",
  WEBSITE = "website",
  NICHE = "niche",
  COMPETITORS = "competitors",
}

export const onboardingConfig = [
  {
    stepLabel: "Channel",
    title: "What's your Channel url?",
    description: "Tell us about your channel url",
    id: ONBOARDING_FORM_ID.USER_NAME,
    label: "Channel",
    placeholder: "https://www.youtube.com/@userhandle",
    inputType: "text",
    isMandatory: true,
  },
  {
    stepLabel: "Niche",
    title: "What's your niche?",
    description: "Select the category that best describes your content",
    id: ONBOARDING_FORM_ID.NICHE,
    label: "Your Niche",
    placeholder: "Enter a niche",
    inputType: "text",
    isMandatory: true,
  },

  {
    stepLabel: "Website",
    title: "What's your website?",
    description: "Enter your website URL to get started",
    id: ONBOARDING_FORM_ID.WEBSITE,
    label: "Website URL",
    placeholder: "https://example.com",
    inputType: "text",
    isMandatory: false,
  },
  {
    stepLabel: "Audience",
    title: "What's your Target Audience?",
    description: "Tell us about your audience",
    id: ONBOARDING_FORM_ID.TARGET_AUDIENCE,
    label: "Target Audience",
    placeholder: "Developers, Kids, etc",
    inputType: "text",
    isMandatory: true,
    className: "col-span-2",
  },

  {
    stepLabel: "Competitors",
    title: "Who are your YouTube competitors?",
    description: "Add links to YouTube channels similar to yours",
    id: ONBOARDING_FORM_ID.COMPETITORS,
    label: "YouTube Competitor",
    placeholder: "https://youtube.com/channel/...",
    inputType: "multi-text",
    isMandatory: true,
  },
];

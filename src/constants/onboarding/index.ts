import { DeepNest } from "@/types/components/onboarding";

export const INITIAL_ONBOARDING_STATE = {
  business: {
    type: "",
    type_other: "",
    offering: "",
    price_point: "",
    recurring_value: "",
    monthly_revenue: "",
    primary_goal: "",
    current_channels: [],
  },

  avatar: {
    definition: "",
    pain_point: "",
    aspiration: "",
    failed_attempts: [],
    false_belief: "",
    online_presence: [],
    burning_questions: [],
  },

  positioning: {
    unique_method: "",
    enemy: "",
    credibility: "",
    one_liner: "",
    competitors: [{ channel: "", doWell: "", missing: "" }],
    winning_content: "",
  },

  production: {
    time_commitment: "",
    experience_level: "",
    preferred_formats: [],
    tone: "",
    team_size: "",
    team_details: "",
    target_cadence: "",
    preferred_days: [],
    preferred_time: "",
    timezone: "",
  },

  assets: {
    existing: [],
    youtube_status: "",
    youtube_url: "",
    email_subscribers: "",
    brand_status: "",
    brand_files: "",
  },

  cta: {
    primary_type: "",
    primary_url: "",
    primary_description: "",
    copy: "",
  },

  integrations: {
    requested: [],
  },

  meta: {
    onboarding_completed: false,
    strategy_generated: false,
    first_ideas_generated: false,
    first_video_scripted: false,
    first_video_published: false,
  },
} satisfies DeepNest;

export const ONBOARDING_FORM = "ONBOARDING_FORM";
export const ONBOARDING_FORM_VERSION = "2";
export const CURRENT_SECTION = "CURRENT_SECTION";
export const CURRENT_QUESTION = "CURRENT_QUESTION";

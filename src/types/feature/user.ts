export interface IUserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string;

  createdAt: string;
  isOnboardingCompleted: boolean;

  assets: {
    brand_files: string;
    brand_status: "yes" | "no";
    email_subscribers: "under_1k" | "1k_to_5k" | "5k_plus";
    existing: string[]; // ["website", "calendar"]
    youtube_status: "yes_active" | "yes_inactive" | "no";
    youtube_url: string;
  };

  avatar: {
    aspiration: string;
    burning_questions: string;
    definition: string;
    failed_attempts: string;
    false_belief: string;
    pain_point: string;
    online_presence: string[]; // ["facebook", "reddit"]
  };

  business: {
    type: "service_business" | "product_business" | "creator" | "other";
    type_other: string;

    offering: string;
    primary_goal: "awareness" | "leads" | "sales";
    recurring_value: string;

    monthly_revenue:
      | "under_5k"
      | "5k_to_10k"
      | "10k_plus";

    price_point:
      | "under_500"
      | "500_to_3k"
      | "3k_plus";

    current_channels: string[]; // ["paid_ads"]
  };

  cta: {
    primary_type: "join_email" | "visit_link" | "book_call";
    primary_url: string;
    primary_description: string;
    copy: string;
  };

  integrations: {
    requested: string[];
  };

  meta: {
    onboarding_completed: boolean;
    first_ideas_generated: boolean;
    first_video_scripted: boolean;
    first_video_published: boolean;
    strategy_generated: boolean;
  };

  positioning: {
    competitors: Array<{
      channel: string;
      doWell: string;
      missing: string;
    }>;

    one_liner: string;
    unique_method: string;
    winning_content: string;
    credibility: string;
    enemy: string;
  };

  production: {
    experience_level: "new_creator" | "regular_creator" | "advanced";
    target_cadence: "1_per_month" | "1_per_week" | "3_per_week";
    preferred_formats: string[]; // ["interview"]
    preferred_days: string[]; // ["wednesday", "thursday"]
    preferred_time: string; // "9pm"
    timezone: string;

    team_size: "solo" | "have_team";
    team_details: string;
    time_commitment: "under_5_hours" | "8_to_12_hours" | "full_time";
    tone: "conversational_casual" | "professional" | "educational";
  };

  stats: {
    credits: number;
    topics: number;
    scripts: number;
  };
}

export interface IUserInitialState {
  data: IUserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

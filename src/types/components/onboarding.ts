/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
export interface Option {
  value: string;
  label: string;
}

// Validation rules (optional per question)
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Conditional field (most questions have this shape)
export interface ConditionalFieldBase {
  id: string;
  label: string;
  type: QuestionTypes;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  options?: Option[];
  path?: string;
}

// Standard conditional rule
export interface StandardConditional {
  triggerValue: string | string[];
  fields: ConditionalFieldBase[];
}

// For production.team conditional (array of conditions)
export interface MultiConditional {
  triggerValue: string | string[];
  fields: ConditionalFieldBase[];
}

// ============ Question Types ============ //
export type QuestionTypes =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "group";

// Base question shared by all
export interface QuestionBase {
  id: string;
  title?: string;
  label: string;
  type: QuestionTypes;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  path?: string;
  minLength?: number;
  maxLength?: number;
  validation?: ValidationRules;
  example?: string;
  conditional?: ConditionalRule | ConditionalRule[];
}

// ----------- Individual Question Types ----------

// Text or Textarea
export interface TextQuestion extends QuestionBase {
  type: "text" | "textarea";
}

// Radio
export interface RadioQuestion extends QuestionBase {
  type: "radio";
  options: Option[];
  conditional?: StandardConditional;
}

// Checkbox
export interface CheckboxQuestion extends QuestionBase {
  type: "checkbox";
  options: Option[];
  conditional?: StandardConditional;
}

// Dropdown
export interface DropdownQuestion extends QuestionBase {
  type: "dropdown";
  options: Option[];
  conditional?: StandardConditional;
}

// Group type (contains sub-fields)
export interface GroupField {
  id: string;
  label: string;
  type: "text";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  path: string;
}

export interface GroupQuestion extends QuestionBase {
  type: "group";
  groupFields: GroupField[];
}

// ----------- Union of all ---------- //
export type Question =
  | TextQuestion
  | RadioQuestion
  | CheckboxQuestion
  | DropdownQuestion
  | GroupQuestion;

// ----------- Section Type ---------- //
export interface SectionType {
  id: string;
  title: string;
  subtitle: string;
  progressOrder: number;
  ctaButton: string;
  questions: Question[];
}

// // ----------- Root Config ---------- //
// export interface ConfigFile {
//   sections: Section[];
// }

export type BaseQuestion = {
  id: string;
  label: string;
  title?: string;
  path: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  validation?: {
    pattern?: string;
    required?: boolean;
  };
};

export type ConditionalRule = {
  triggerValue: string | string[];
  fields: (
    | TextQuestion
    | DropdownQuestion
    | RadioQuestion
    | CheckboxQuestion
  )[];
};

export type QuestionType =
  | TextQuestion
  | RadioQuestion
  | CheckboxQuestion
  | DropdownQuestion
  | GroupQuestion;

export interface IOnboardingPayload {
  business: {
    type: string;
    type_other: string;
    offering: string;
    price_point: string;
    recurring_value: string;
    monthly_revenue: string;
    primary_goal: string;
    current_channels: string[];
  };

  avatar: {
    definition: string;
    pain_point: string;
    aspiration: string;
    failed_attempts: string[]; // textarea with multiple lines
    false_belief: string;
    online_presence: string[];
    burning_questions: string[];
  };

  positioning: {
    unique_method: string;
    enemy: string;
    credibility: string;
    one_liner: string;
    competitors: {
      channel: string;
      doWell: string;
      missing: string;
    }[];
    winning_content: string;
  };

  production: {
    time_commitment: string;
    experience_level: string;
    preferred_formats: string[];
    tone: string;
    team_size: string;
    team_details: string | string[];
    // team_details becomes:
    // - textarea (string) for have_team/full_team
    // - checkbox string[] for have_editor
    target_cadence: string;
    preferred_days: string[];
    preferred_time: string;
    timezone: string;
  };

  assets: {
    existing: string[];
    youtube_status: string;
    youtube_url: string;
    email_subscribers: string;
    brand_status: string;
    brand_files: string;
  };

  cta: {
    primary_type: string;
    primary_url: string;
    primary_description: string;
    copy: string;
  };

  integrations: {
    requested: string[];
  };

  meta: {
    onboarding_completed: boolean;
    strategy_generated: boolean;
    first_ideas_generated: boolean;
    first_video_scripted: boolean;
    first_video_published: boolean;
  };
}

export type NestedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | NestedObject
  | NestedValue[];

export interface NestedObject {
  [key: string]: NestedValue;
}

export type DeepNest =
  | string
  | number
  | boolean
  | null
  | undefined
  | DeepNest[]
  | { [K in string]: DeepNest };

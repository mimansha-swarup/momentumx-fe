export type VideoFormat = "talking_head" | "faceless";

export interface ICompetitor {
  url: string;
  id?: string;
  titles?: string[];
}

// Read-time, weighted profile completeness from GET /v1/user/profile.
export interface IProfileCompleteness {
  score: number; // 0–100
  missing: string[]; // unfilled field keys, priority order
}

// Flat user record as the backend actually returns it (GET /v1/user/profile).
export interface IUserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  createdAt?: string;
  isOnboardingCompleted?: boolean;

  userName?: string; // YouTube channel URL (legacy field name)
  brandName?: string;
  niche?: string;
  targetAudience?: string;
  website?: string;
  format?: VideoFormat;
  competitors?: ICompetitor[];

  // Server-enriched, read-only on the client.
  websiteContent?: string;
  channelDescription?: string;
  userTitle?: string[];

  stats?: { credits?: number; topics?: number; scripts?: number };
  completeness?: IProfileCompleteness;
}

// Body for PATCH /onboarding and PATCH /profile — flat, every field optional.
// `competitors` is sent as bare channel URLs; the server enriches them.
export interface IProfileInput {
  userName?: string;
  brandName?: string;
  niche?: string;
  targetAudience?: string;
  website?: string;
  format?: VideoFormat;
  competitors?: string[];
}

export interface IPrefillSuggestions {
  niche: string;
  targetAudience: string;
  brandName: string;
}

export interface IPrefillResponse {
  suggestions: IPrefillSuggestions;
  channel: { channelDescription: string; topTitles: string[] };
}

export interface IUserInitialState {
  data: IUserProfile | null;
  isLoading: boolean;
  isUpdating: boolean; // profile edit (settings)
  isPrefilling: boolean;
  isRefreshing: boolean; // refresh-context
  prefill: IPrefillResponse | null;
  error: string | null;
}

// Packaging Feature Types

export interface ITimestampedSegment {
  startTime: string; // "0:00"
  endTime: string; // "0:15"
  content: string;
  type: "hook" | "point" | "cta" | "transition";
}

export interface IHooks {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
}

export interface IPackagingOutput {
  content: string;
  isLoading: boolean;
  error: string | null;
}

export interface IHooksOutput {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
  isLoading: boolean;
  error: string | null;
}

export interface IShortsScript {
  id: string;
  segments: ITimestampedSegment[];
  isLoading: boolean;
  error: string | null;
}

export interface IShortsOutput {
  scripts: IShortsScript[];
  isAddingNew: boolean;
}

export const MAX_SHORTS_SCRIPTS = 5;

export interface IPackagingState {
  // Input
  script: string;

  // Generated outputs
  title: IPackagingOutput;
  description: IPackagingOutput;
  thumbnailDescription: IPackagingOutput;
  hooks: IHooksOutput;
  shortsScript: IShortsOutput;

  // Meta
  isSaving: boolean;
  savedAt: string | null;
  packagingId: string | null;
  isGeneratingAll: boolean;
}

// API Request/Response Types
export interface GenerateTitleRequest {
  script: string;
  userId: string;
}

export interface GenerateTitleResponse {
  title: string;
  characterCount: number;
}

export interface GenerateDescriptionRequest {
  script: string;
  title?: string;
  userId: string;
}

export interface GenerateDescriptionResponse {
  description: string;
  characterCount: number;
}

export interface GenerateThumbnailRequest {
  script: string;
  title?: string;
  userId: string;
}

export interface GenerateThumbnailResponse {
  thumbnailDescription: string;
  characterCount: number;
}

export interface GenerateHooksRequest {
  script: string;
  userId: string;
}

export interface GenerateHooksResponse {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
}

export interface GenerateShortsRequest {
  script: string;
  userId: string;
  maxDuration?: number;
}

export interface GenerateShortsResponse {
  segments: ITimestampedSegment[];
  totalDuration: string;
}

export interface SavePackagingRequest {
  userId: string;
  scriptId?: string;
  script: string;
  title: string;
  description: string;
  thumbnailDescription: string;
  hooks: IHooks;
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
}

export interface SavePackagingResponse {
  packagingId: string;
  savedAt: string;
}

export interface GetPackagingResponse {
  packagingId: string;
  script: string;
  title: string;
  description: string;
  thumbnailDescription: string;
  hooks: IHooks;
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
  createdAt: string;
  updatedAt: string;
}

// Character limits for validation
export const PACKAGING_LIMITS = {
  title: 100,
  description: 5000,
  thumbnailDescription: 500,
  openingHook: 280,
  patternInterrupt: 280,
  ctaHook: 280,
} as const;

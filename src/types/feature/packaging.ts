// Packaging Feature Types

export interface ITimestampedSegment {
  startTime: string; // "0:00"
  endTime: string; // "0:15"
  content: string;
  type: "hook" | "point" | "cta" | "transition";
}

// Title object from API
export interface ITitle {
  title: string;
}

// Thumbnail description object from API
export interface IThumbnailDescription {
  visual_concept: string;
  composition: string;
  text_overlay: string;
  colors: string;
  facial_expression: string;
  style_references: string;
  reasoning: string;
}

// Multi-variant output types
export interface ITitlesOutput {
  titles: ITitle[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
}

export interface IThumbnailsOutput {
  descriptions: IThumbnailDescription[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
}

export interface IHooksOutput {
  hooks: string[];  // Simple string array
  isLoading: boolean;
  error: string | null;
}

export interface IDescriptionOutput {
  content: string;
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

  // Generated outputs (multi-variant)
  titles: ITitlesOutput;
  description: IDescriptionOutput;
  thumbnails: IThumbnailsOutput;
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
  titles: ITitle[];  // 3 title variations as objects
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
  descriptions: IThumbnailDescription[];  // 3 thumbnail brief variations as objects
}

export interface GenerateHooksRequest {
  script: string;
  userId: string;
}

export interface GenerateHooksResponse {
  hooks: string[];  // Multiple hook strings
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
  titles: ITitle[];
  selectedTitleIndex: number;
  description: string;
  thumbnails: IThumbnailDescription[];
  selectedThumbnailIndex: number;
  hooks: string[];
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
}

export interface SavePackagingResponse {
  packagingId: string;
  savedAt: string;
}

export interface GetPackagingResponse {
  packagingId: string;
  script: string;
  titles: ITitle[];
  selectedTitleIndex: number;
  description: string;
  thumbnails: IThumbnailDescription[];
  selectedThumbnailIndex: number;
  hooks: string[];
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
  createdAt: string;
  updatedAt: string;
}

// Character limits for validation
export const PACKAGING_LIMITS = {
  title: 100,
  description: 5000,
  thumbnailDescription: 500,
  hook: 500,
} as const;

export const MAX_TITLE_VARIATIONS = 3;
export const MAX_THUMBNAIL_VARIATIONS = 3;
export const MAX_HOOKS = 5;

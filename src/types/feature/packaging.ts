// Packaging Feature Types

export type PackagingItemStatus = "not_started" | "completed" | "stale";

export type PackagingItemName = "title" | "description" | "thumbnail" | "shorts";

export interface PackagingItemStatuses {
  title: PackagingItemStatus;
  description: PackagingItemStatus;
  thumbnail: PackagingItemStatus;
  shorts: PackagingItemStatus;
}

export interface ITimestampedSegment {
  startTime: string; // "0:00"
  endTime: string; // "0:15"
  content: string;
  type: "hook" | "point" | "cta" | "transition";
}

// Title object from API
export interface ITitle {
  title: string;
  characterCount: number;
}

// Multi-variant output types
export interface ITitlesOutput {
  titles: ITitle[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
}

export interface IThumbnailsOutput {
  descriptions: string[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
}

export interface IHooksOutput {
  hooks: string[]; // Simple string array
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
  totalDuration?: string;
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
  packagingId: string | null;
  isGeneratingAll: boolean;

  // List / detail
  packagingList: GetPackagingResponse[];
  isListLoading: boolean;
  currentPackaging: GetPackagingResponse | null;
  isDetailLoading: boolean;

  // Per-item feedback state
  itemFeedback: Partial<Record<PackagingItemName, "like" | "dislike" | null>>;

  // Per-operation flags
  isRegeneratingItem: boolean;
  isSubmittingFeedback: boolean;
  isExporting: boolean;

  // Export result
  exportText: string | null;

  error: string | null;
}

// API Request/Response Types
export interface GenerateTitleRequest {
  script: string;
}

export interface GenerateTitleResponse {
  titles: ITitle[]; // 3 title variations as objects
}

export interface GenerateDescriptionRequest {
  script: string;
  title: string;
}

export interface GenerateDescriptionResponse {
  description: string;
}

export interface GenerateThumbnailRequest {
  script: string;
  title: string;
}

export interface GenerateThumbnailResponse {
  descriptions: string[]; // 3 thumbnail brief variations as plain strings
}

export interface GenerateHooksRequest {
  script: string;
}

export interface GenerateHooksResponse {
  hooks: string[]; // Multiple hook strings
}

export interface GenerateShortsRequest {
  script: string;
  duration: number;
}

export interface GenerateShortsResponse {
  segments: ITimestampedSegment[];
  totalDuration: string;
}

export interface SavePackagingRequest {
  videoProjectId?: string;
  script: string;
  titles: ITitle[];
  selectedTitleIndex: number;
  description: string;
  thumbnails: string[];
  selectedThumbnailIndex: number;
  hooks: string[];
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
}

export interface SavePackagingResponse {
  id: string;
}

export interface GetPackagingResponse {
  id: string;
  script: string;
  titles: ITitle[];
  selectedTitleIndex: number;
  description: string;
  thumbnails: string[];
  selectedThumbnailIndex: number;
  hooks: string[];
  shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
  createdAt: string;
  isStale: boolean;
  staleReason: "script_regenerated" | "hooks_regenerated" | null;
  staleSince: string | null;
  itemStatuses: PackagingItemStatuses;
}

// Discriminated union for regenerateItem thunk return type
export type RegenerateItemResponse =
  | { item: "title"; data: { titles?: ITitle[] } }
  | { item: "description"; data: { description?: string } }
  | { item: "thumbnail"; data: { descriptions?: string[] } }
  | { item: "shorts"; data: { segments?: ITimestampedSegment[]; totalDuration?: string } };

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

// Hooks Feature Types

export type FeedbackValue = "like" | "dislike" | null;

export interface IHooksBatch {
  id: string;
  videoProjectId: string;
  createdBy: string;
  hooks: string[];
  hookFeedback: Record<string, FeedbackValue>;
  createdAt: string;
}

// API Request/Response Types
export interface GenerateHooksRequest {
  videoProjectId: string;
  script: string;
}

export interface SelectHookRequest {
  hookIndex: number;
  videoProjectId: string;
}

export interface SelectHookResponse {
  id: string;
  hooksId: string;
  selectedHookIndex: number;
}

export interface RegenerateHooksRequest {
  script: string;
}

export interface HookFeedbackRequest {
  hookIndex: number;
  feedback: FeedbackValue;
}

export interface HookFeedbackResponse {
  id: string;
  hookIndex: number;
  feedback: FeedbackValue;
}

export interface ExportHooksResponse {
  text: string;
  count: number;
}

// Redux State
export interface IHooksState {
  batch: IHooksBatch | null;
  selectedHookIndex: number | null;
  isLoading: boolean;
  isRegenerating: boolean;
  isSelecting: boolean;
  isExporting: boolean;
  isSubmittingFeedback: boolean;
  error: string | null;
}

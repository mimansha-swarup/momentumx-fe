// Hooks Feature Types

export interface IHooksBatch {
  id: string;
  videoProjectId: string;
  createdBy: string;
  hooks: string[];
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
  error: string | null;
}

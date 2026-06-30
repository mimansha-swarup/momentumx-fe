// Video Project Feature Types

export type StepStatus = "not_started" | "in_progress" | "completed" | "stale";
export type StepName = "research" | "script" | "hooks" | "packaging";
export type OverallStatus = "in_progress" | "completed" | "stale";
export type ResourceType = "script" | "hooks" | "packaging";

export interface IPipelineStep {
  status: StepStatus;
  startedAt: string | null;
  completedAt: string | null;
  items?: {
    title: StepStatus;
    description: StepStatus;
    thumbnail: StepStatus;
    shorts: StepStatus;
  };
}

export interface IPipeline {
  research: IPipelineStep;
  script: IPipelineStep;
  hooks: IPipelineStep;
  packaging: IPipelineStep;
}

export interface IVideoProject {
  id: string;
  createdBy: string;
  title: string;
  /** The ID of the topic this project was created from. */
  topicId: string;
  /**
   * The generated script's id — a UUID distinct from `topicId`, set once a
   * script is generated. Use this (not `topicId`) for script fetch/edit/export/
   * regenerate/feedback. Script streaming is keyed by the project id instead.
   */
  scriptId: string | null;
  hooksId: string | null;
  selectedHookIndex: number | null;
  packagingId: string | null;
  currentStep: StepName;
  overallStatus: OverallStatus;
  pipeline: IPipeline;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IVideoProjectListItem {
  id: string;
  title: string;
  currentStep: StepName;
  overallStatus: OverallStatus;
  updatedAt: string;
  createdAt: string;
  thumbnailHint: string | null;
}

export interface IStepTransitionResponse {
  id: string;
  currentStep: StepName;
  pipeline: Partial<Record<StepName, IPipelineStep>>;
  updatedAt: string;
  overallStatus?: OverallStatus;
}

// API Request/Response Types
export interface CreateProjectRequest {
  topicId: string;
}

export interface ListProjectsParams {
  status?: OverallStatus;
  limit?: number;
  cursor?: string;
}

export interface ListProjectsResponse {
  projects: IVideoProjectListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface UpdateWorkingTitleRequest {
  title: string;
}

export interface LinkResourceRequest {
  resourceId: string;
}

// Redux State
export interface IVideoProjectState {
  projects: IVideoProjectListItem[];
  hasMore: boolean;
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;

  currentProject: IVideoProject | null;
  isLoadingProject: boolean;
  projectError: string | null;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isStepTransitioning: boolean;
  isLinkingResource: boolean;
}

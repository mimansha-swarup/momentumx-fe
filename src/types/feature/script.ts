export interface IGeneratedScript {
  title: string;
  script: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  userFeedback?: "like" | "dislike" | null;
}

export interface IScriptState {
  data: IGeneratedScript[] | null;
  currentScript: IGeneratedScript | null;
  isLoadingCurrent: boolean;
  isLoading: boolean;
  isDone: boolean;
  error: string | null;
  isSubmittingFeedback: boolean;
  isExporting: boolean;
  exportResult: { title: string; text: string } | null;
  isRegenerating: boolean;
  isEditing: boolean;
}

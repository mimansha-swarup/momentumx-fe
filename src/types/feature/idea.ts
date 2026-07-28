import { IGeneratedIdea } from "@/types/components/dashboard";

export interface IIdeaData {
  meta: {
    nextCursor: {
      createdAt: string;
      docId: string;
    } | null;
    hasNextPage: boolean;
  };
  lists: IGeneratedIdea[];
}
export const enum IdeaFilters {
  ALL = "all",
  GENERATED = "generated",
  // STARED= "stared",
}
export interface IIdeaParams {
  searchText: string;
  filter: `${IdeaFilters}`;
  // isFresh?: boolean;
}
export interface IIdeaState {
  data: IIdeaData | null;
  params: IIdeaParams;
  isLoading: boolean;
  isDone: boolean;
  isEditing: boolean;
  isRegenerating: boolean;
  isExporting: boolean;
  exportText: string | null;
  error: string | null;
}

import { IGeneratedTopic } from "../components/dashboard";

export interface ITitleData {
  meta: {
    nextCursor: {
      createdAt: string;
      docId: string;
    } | null;
    hasNextPage: boolean;
  };
  lists: IGeneratedTopic[];
}
export const enum TitleFilters {
  ALL = "all",
  GENERATED = "generated",
  // STARED= "stared",
}
export interface ITitleParams {
  searchText: string;
  filter: `${TitleFilters}`;
  // isFresh?: boolean;
}
export interface ITitleState {
  data: ITitleData | null;
  params: ITitleParams;
  isLoading: boolean;
  isDone: boolean;
  isEditing: boolean;
  isRegenerating: boolean;
  isExporting: boolean;
  isSubmittingFeedback: boolean;
  exportText: string | null;
  error: string | null;
}

import { IGeneratedTopic } from "../components/dashboard";

export interface ITitleData {
  meta: {
    nextCursor: {
      createdAt: string;
      docId: string;
    };
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
}

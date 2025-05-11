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
export interface ITitleState {
  data: ITitleData| null;
  isLoading: boolean;
  isDone: boolean;
}

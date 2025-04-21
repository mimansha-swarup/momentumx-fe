import { IGeneratedTopic } from "../components/dashboard";

export interface ITitleState {
  data: IGeneratedTopic[] | null;
  isLoading: boolean;
  isDone: boolean;
}

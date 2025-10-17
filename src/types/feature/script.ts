export interface IGeneratedScript {
  title: string;
  script: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
}

export interface IScriptState {
  data: IGeneratedScript[] | null;
  isLoading: boolean;
  isDone: boolean;
}



export interface IGeneratedScript {
  title: string;
  script: string;
  id: string;
  createdAt: string;
  createdBy: string;
}

export interface IScriptState {
  data: IGeneratedScript[] | null;
  isLoading: boolean;
  isDone: boolean;
}

export interface ITitleGeneratorAnalysis {
  topic: string;
  keywords: string[];
  emotion: string;
  intent: string;
}

export interface ITitleGeneratorPatterns {
  patterns: string[];
  insights: string;
}

export interface IGeneratedTitle {
  title: string;
  score: number;
  reason: string;
}

export interface ITitleGeneratorResult {
  analysis: ITitleGeneratorAnalysis;
  patterns: ITitleGeneratorPatterns;
  titles: IGeneratedTitle[];
}

export interface ITitleGeneratorPayload {
  idea?: string;
  script?: string;
}

export type TitleGenerationMode = "normal" | "deep" | null;

export interface ITitleGeneratorState {
  result: ITitleGeneratorResult | null;
  generationMode: TitleGenerationMode;
  isLoading: boolean;
  isDeepLoading: boolean;
  error: string | null;
}

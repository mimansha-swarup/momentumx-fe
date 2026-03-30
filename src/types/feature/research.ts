// Research Intelligence Feature Types

export interface ITrendingVideo {
  title: string;
  channelTitle: string;
  videoId: string;
}

export interface ICompetitorChannel {
  channelTitle: string;
  titles: string[];
}

export interface IKeywordResult {
  title: string;
  channelTitle: string;
}

export interface IResearchState {
  trending: {
    videos: ITrendingVideo[];
    isLoading: boolean;
    error: string | null;
  };
  competitors: {
    channels: ICompetitorChannel[];
    isLoading: boolean;
    error: string | null;
  };
  keywords: {
    results: IKeywordResult[];
    isLoading: boolean;
    error: string | null;
  };
}

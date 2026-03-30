import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  ITrendingVideo,
  ICompetitorChannel,
  IKeywordResult,
} from "@/types/feature/research";

const URLS = {
  trending: "/v1/research/trending",
  competitors: "/v1/research/competitors",
  keywords: "/v1/research/keywords",
};

class ResearchService {
  private urls = URLS;

  async getTrending(): Promise<IBaseFetchResponse<ITrendingVideo[]>> {
    const response = await baseFetch.get(this.urls.trending);
    return response.data;
  }

  async getCompetitors(): Promise<IBaseFetchResponse<ICompetitorChannel[]>> {
    const response = await baseFetch.get(this.urls.competitors);
    return response.data;
  }

  async getKeywords(
    query: string
  ): Promise<IBaseFetchResponse<IKeywordResult[]>> {
    const response = await baseFetch.get(this.urls.keywords, {
      params: { query },
    });
    return response.data;
  }
}

export const researchService = new ResearchService();

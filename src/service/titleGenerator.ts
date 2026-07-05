import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import { ITitleGeneratorPayload, ITitleGeneratorResult } from "@/types/feature/titleGenerator";

const URLS = {
  generate: "/v1/title-intelligence/generate",
  deepGenerate: "/v1/title-intelligence/deep-generate   ",
};

class TitleGeneratorService {
  private urls = URLS;

  async generate(
    payload: ITitleGeneratorPayload
  ): Promise<IBaseFetchResponse<ITitleGeneratorResult>> {
    const response = await baseFetch.post(this.urls.generate, payload);
    return response.data;
  }

  async deepGenerate(
    payload: ITitleGeneratorPayload
  ): Promise<IBaseFetchResponse<ITitleGeneratorResult>> {
    const response = await baseFetch.post(this.urls.deepGenerate, payload);
    return response.data;
  }
}

export const titleGeneratorService = new TitleGeneratorService();

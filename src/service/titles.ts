import { baseFetch } from "@/utils/network";

const URLS = {
  titles: "/v1/content/topics",
  streamTitles: "/v1/content/stream/topics",
};
class TitleService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  generateTitles = async () => {
    try {
      const response = await baseFetch.get(this.urls.streamTitles);
      return response.data;
    } catch (error) {
      console.error("Error while fetching saved titles", error);
    }
  };

  async getGeneratedData(query?: Record<string, unknown>) {
    try {
      const response = await baseFetch.get(this.urls.titles, {
        params: query,
      });
      return response.data;
    } catch {
      console.error("Error while fetching saved titles");
    }
  }
}

export const titleService = new TitleService();

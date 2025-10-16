import { baseFetch } from "@/utils/network";

const URLS = {
  titles: "/v1/content/topics",
  streamTitles: "/v1/content/stream/topics",
  editTitle: "/v1/content/topics/edit/{{titleId}}",
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

  async editTitle(titleId:string, body: Record<string, unknown>) {
    try {
      const response = await baseFetch.patch(
        this.urls.editTitle.replace("{{titleId}}", titleId),
        body
      );
      return response.data;
    } catch (error) {
      console.error("Error while fetching saved titles", error);
    }
  }
}

export const titleService = new TitleService();

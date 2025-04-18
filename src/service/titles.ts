import { baseFetch } from "@/utils/network";
import { handleToast } from "@/utils/toast";

const URLS = {
  titles: "/v1/content/topics",
};
export class TitleService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  async generateTitles() {
    try {
      const response = await baseFetch.post(this.urls.titles);
      handleToast(response.data);
      return response.data;
    } catch {
      console.error("Error while generating Titles");
    }
  }

  async getGeneratedData() {
    try {
      const response = await baseFetch.get(this.urls.titles);
      return response.data;
    } catch {
      console.error("Error while fetching saved titles");
    }
  }
}

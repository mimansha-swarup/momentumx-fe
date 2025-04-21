import { addTitle, markDone } from "@/utils/feature/titles/titles.slice";
import { auth } from "@/utils/firebase/config";
import { baseFetch, getApiDomain } from "@/utils/network";
import { AppDispatch } from "@/utils/store";

const URLS = {
  titles: "/v1/content/topics",
  streamTitles: "/v1/content/stream/topics",
};
class TitleService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  startStreamingTitles = async (dispatch: AppDispatch) => {
    const token = await auth.currentUser?.getIdToken();
    const evtSource = new EventSource(
      getApiDomain() + this.urls.streamTitles + `?token=${token}`
    );

    evtSource.onmessage = (e) => {
      const title = JSON.parse(e.data);
      dispatch(addTitle(title));
    };

    evtSource.addEventListener("done", () => {
      dispatch(markDone());
      evtSource.close();
    });

    evtSource.onerror = (e) => {
      console.log("SSE Error:", e);
      evtSource.close(); // close on error (or add retry)
    };

    return evtSource; // optionally return for later closing
  };

  async getGeneratedData() {
    try {
      const response = await baseFetch.get(this.urls.titles);
      return response.data;
    } catch {
      console.error("Error while fetching saved titles");
    }
  }
}

export const titleService = new TitleService();

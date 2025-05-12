import { auth } from "@/utils/firebase/config";
import { baseFetch, getApiDomain } from "@/utils/network";

const URLS = {
  scripts: "/v1/content/scripts",
  streamScript: "/v1/content/stream/scripts/{scriptId}",
  scriptById: "/v1/content/stream/script/{scriptId}",
};
class ScriptService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  startStreamingScripts = async (
    id: string,
    setter: (prev: string) => void,
    onDone: () => void
  ) => {
    const token = await auth.currentUser?.getIdToken();
    const url = this.urls.streamScript.replace("{scriptId}", id);
    const evtSource = new EventSource(getApiDomain() + url + `?token=${token}`);

    evtSource.onmessage = (e) => {
      const script = JSON.parse(e.data);
      setter(script);
      // dispatch(addScript(script));
    };

    evtSource.addEventListener("done", () => {
      // dispatch(markDone());
      console.log("fone");

      onDone?.();

      evtSource.close();
    });

    evtSource.onerror = (e) => {
      console.log("SSE Error:", e);
      evtSource.close(); // close on error (or add retry)
    };

    return evtSource; // optionally return for later closing
  };

  async getGeneratedScript() {
    try {
      const response = await baseFetch.get(this.urls.scripts);
      return response.data;
    } catch {
      console.error("Error while fetching saved titles");
    }
  }
}

export const scriptService = new ScriptService();

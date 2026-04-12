import { auth } from "@/utils/firebase/config";
import { baseFetch, getApiDomain, IBaseFetchResponse } from "@/utils/network";
import { IGeneratedScript } from "@/types/feature/script";

type FeedbackValue = "like" | "dislike" | null;

const URLS = {
  scripts: "/v1/scripts",
  streamScript: "/v1/scripts/stream/{scriptId}",
  scriptById: "/v1/scripts/{scriptId}",
  editScript: "/v1/scripts/edit/{scriptId}",
  feedback: "/v1/scripts/{scriptId}/feedback",
  export: "/v1/scripts/{scriptId}/export",
  regenerate: "/v1/scripts/{scriptId}/regenerate",
};
class ScriptService {
  private urls;
  constructor() {
    this.urls = URLS;
  }

  // SSE via EventSource cannot send custom headers, so the Firebase token
  // is passed as a query parameter. This is the only endpoint that does this.
  startStreamingScripts = async (
    id: string,
    setter: (prev: string) => void,
    onDone: () => void,
    onError: () => void
  ) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Authentication token unavailable");
    }

    const url = this.urls.streamScript.replace("{scriptId}", id);
    const evtSource = new EventSource(
      getApiDomain(true) + url + `?token=${token}`
    );

    evtSource.onmessage = (e) => {
      try {
        const script = JSON.parse(e.data);
        setter(script);
      } catch {
        // Skip malformed SSE chunks
      }
    };

    evtSource.addEventListener("done", () => {
      onDone();
      evtSource.close();
    });

    evtSource.onerror = () => {
      evtSource.close();
      onError();
    };

    return evtSource;
  };

  async getGeneratedScript(): Promise<IBaseFetchResponse<IGeneratedScript[]>> {
    const response = await baseFetch.get(this.urls.scripts);
    return response.data;
  }

  async getScriptById(id: string): Promise<IBaseFetchResponse<IGeneratedScript>> {
    const response = await baseFetch.get(
      this.urls.scriptById.replace("{scriptId}", id)
    );
    return response.data;
  }

  async editScript(id: string, data: { script: string }): Promise<IBaseFetchResponse<IGeneratedScript>> {
    const response = await baseFetch.patch(
      this.urls.editScript.replace("{scriptId}", id),
      data
    );
    return response.data;
  }

  async submitFeedback(
    scriptId: string,
    feedback: FeedbackValue
  ): Promise<IBaseFetchResponse<{ id: string; userFeedback: FeedbackValue }>> {
    const response = await baseFetch.patch(
      this.urls.feedback.replace("{scriptId}", scriptId),
      { feedback }
    );
    return response.data;
  }

  async exportScript(
    scriptId: string
  ): Promise<IBaseFetchResponse<{ title: string; text: string }>> {
    const response = await baseFetch.get(
      this.urls.export.replace("{scriptId}", scriptId)
    );
    return response.data;
  }

  async regenerateScript(
    scriptId: string
  ): Promise<IBaseFetchResponse<{ id: string; title: string; script: string }>> {
    const response = await baseFetch.post(
      this.urls.regenerate.replace("{scriptId}", scriptId)
    );
    return response.data;
  }
}

export const scriptService = new ScriptService();

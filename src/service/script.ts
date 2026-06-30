import { auth } from "@/utils/firebase/config";
import { baseFetch, getApiDomain, IBaseFetchResponse } from "@/utils/network";
import { IGeneratedScript } from "@/types/feature/script";

type FeedbackValue = "like" | "dislike" | null;

const URLS = {
  scripts: "/v1/scripts",
  streamScript: "/v1/scripts/stream/{projectId}",
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
  // Script generation is project-scoped: pass the video-project id; the server
  // resolves the topic and links the generated script back to the project.
  startStreamingScripts = async (
    projectId: string,
    setter: (chunk: string) => void,
    onDone: () => void,
    onError: () => void
  ) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Authentication token unavailable");
    }

    const url = this.urls.streamScript.replace("{projectId}", projectId);
    const evtSource = new EventSource(
      getApiDomain(true) + url + `?token=${token}`
    );

    let consecutiveErrors = 0;
    evtSource.onmessage = (e) => {
      // The stream terminates with a raw (non-JSON) sentinel frame.
      if (e.data === "[DONE]") {
        onDone();
        evtSource.close();
        return;
      }
      try {
        // Each data frame is a JSON-encoded string chunk.
        const chunk = JSON.parse(e.data) as string;
        consecutiveErrors = 0;
        setter(chunk);
      } catch {
        consecutiveErrors++;
        if (consecutiveErrors >= 10) {
          onError();
          evtSource.close();
        }
      }
    };

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

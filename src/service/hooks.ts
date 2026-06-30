import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  IHooksBatch,
  SelectHookResponse,
  HookFeedbackResponse,
  ExportHooksResponse,
  FeedbackValue,
} from "@/types/feature/hooks";

const URLS = {
  generate: "/v1/hooks/generate",
  select: "/v1/hooks/{hooksId}/select",
  regenerate: "/v1/hooks/{hooksId}/regenerate",
  feedback: "/v1/hooks/{hooksId}/feedback",
  export: "/v1/hooks/{hooksId}/export",
};

class HooksService {
  private urls = URLS;

  async generateHooks(
    videoProjectId: string,
    script: string
  ): Promise<IBaseFetchResponse<IHooksBatch>> {
    const response = await baseFetch.post(this.urls.generate, {
      videoProjectId,
      script,
    });
    return response.data;
  }

  async selectHook(
    hooksId: string,
    hookIndex: number
  ): Promise<IBaseFetchResponse<SelectHookResponse>> {
    // The owning project is resolved server-side from the stored hooks batch.
    const response = await baseFetch.post(
      this.urls.select.replace("{hooksId}", hooksId),
      { hookIndex }
    );
    return response.data;
  }

  async regenerateHooks(
    hooksId: string,
    script: string
  ): Promise<IBaseFetchResponse<Partial<IHooksBatch>>> {
    const response = await baseFetch.post(
      this.urls.regenerate.replace("{hooksId}", hooksId),
      { script }
    );
    return response.data;
  }

  async submitFeedback(
    hooksId: string,
    hookIndex: number,
    feedback: FeedbackValue
  ): Promise<IBaseFetchResponse<HookFeedbackResponse>> {
    const response = await baseFetch.patch(
      this.urls.feedback.replace("{hooksId}", hooksId),
      { hookIndex, feedback }
    );
    return response.data;
  }

  async exportHooks(
    hooksId: string
  ): Promise<IBaseFetchResponse<ExportHooksResponse>> {
    const response = await baseFetch.get(
      this.urls.export.replace("{hooksId}", hooksId)
    );
    return response.data;
  }
}

export const hooksService = new HooksService();

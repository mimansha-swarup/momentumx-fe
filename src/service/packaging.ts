import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  GenerateTitleResponse,
  GenerateDescriptionResponse,
  GenerateThumbnailResponse,
  GenerateHooksResponse,
  GenerateShortsResponse,
  SavePackagingResponse,
  GetPackagingResponse,
  RegenerateItemResponse,
  ITitle,
  ITimestampedSegment,
} from "@/types/feature/packaging";

type FeedbackValue = "like" | "dislike" | null;
type PackagingItem = "title" | "description" | "thumbnail" | "shorts";

const URLS = {
  generateTitle: "/v1/packaging/generate-title",
  generateDescription: "/v1/packaging/generate-description",
  generateThumbnail: "/v1/packaging/generate-thumbnail",
  generateHooks: "/v1/packaging/generate-hooks",
  generateShorts: "/v1/packaging/generate-shorts",
  save: "/v1/packaging/save",
  list: "/v1/packaging/list",
  get: "/v1/packaging/{{packagingId}}",
  regenerateItem: "/v1/packaging/{{packagingId}}/regenerate/{{item}}",
  feedback: "/v1/packaging/{{packagingId}}/feedback",
  export: "/v1/packaging/{{packagingId}}/export",
};

class PackagingService {
  private urls;

  constructor() {
    this.urls = URLS;
  }

  // The selected hook is resolved server-side from the project's stored
  // selection — pass `videoProjectId` (optional) instead of hook text.
  async generateTitle(
    script: string,
    videoProjectId?: string
  ): Promise<IBaseFetchResponse<GenerateTitleResponse>> {
    const response = await baseFetch.post(this.urls.generateTitle, {
      script,
      ...(videoProjectId !== undefined && { videoProjectId }),
    });
    return response.data;
  }

  async generateDescription(
    script: string,
    title: string,
    videoProjectId?: string
  ): Promise<IBaseFetchResponse<GenerateDescriptionResponse>> {
    const response = await baseFetch.post(this.urls.generateDescription, {
      script,
      title,
      ...(videoProjectId !== undefined && { videoProjectId }),
    });
    return response.data;
  }

  async generateThumbnail(
    script: string,
    title: string,
    videoProjectId?: string
  ): Promise<IBaseFetchResponse<GenerateThumbnailResponse>> {
    const response = await baseFetch.post(this.urls.generateThumbnail, {
      script,
      title,
      ...(videoProjectId !== undefined && { videoProjectId }),
    });
    return response.data;
  }

  /**
   * @deprecated Use `hooksService.generateHooks()` for video project flows.
   * This method calls the legacy stateless endpoint and will be removed
   * when the packaging page is integrated into the video project pipeline.
   */
  async generateHooks(
    script: string
  ): Promise<IBaseFetchResponse<GenerateHooksResponse>> {
    const response = await baseFetch.post(this.urls.generateHooks, { script });
    return response.data;
  }

  async generateShorts(
    script: string,
    duration: number = 60
  ): Promise<IBaseFetchResponse<GenerateShortsResponse>> {
    const response = await baseFetch.post(this.urls.generateShorts, {
      script,
      duration,
    });
    return response.data;
  }

  async generateTitleDependentContent(
    script: string,
    duration: number = 60,
    videoProjectId?: string
  ): Promise<{
    title: GenerateTitleResponse;
    description: GenerateDescriptionResponse;
    thumbnail: GenerateThumbnailResponse;
    shorts: GenerateShortsResponse;
  }> {
    // First, get titles (returns array of 3)
    const titleResponse = await this.generateTitle(script, videoProjectId);
    // Use the first title for dependent content generation
    const titleText = titleResponse?.data?.titles?.[0]?.title ?? "";

    // Then call description, thumbnail, and shorts in parallel with the title
    const [description, thumbnail, shorts] = await Promise.all([
      this.generateDescription(script, titleText, videoProjectId),
      this.generateThumbnail(script, titleText, videoProjectId),
      this.generateShorts(script, duration),
    ]);

    return {
      title: titleResponse.data ?? { titles: [] },
      description: description.data ?? { description: "" },
      thumbnail: thumbnail.data ?? { descriptions: [] },
      shorts: shorts.data ?? { segments: [], totalDuration: "0:00" },
    };
  }

  async savePackaging(data: {
    videoProjectId?: string;
    script: string;
    titles: ITitle[];
    selectedTitleIndex: number;
    description: string;
    thumbnail: string[];
    selectedThumbnailIndex: number;
    hooks: string[];
    shorts: { segments: ITimestampedSegment[]; totalDuration?: string };
  }): Promise<IBaseFetchResponse<SavePackagingResponse>> {
    const response = await baseFetch.post(this.urls.save, data);
    return response.data;
  }

  async getPackaging(
    packagingId: string
  ): Promise<IBaseFetchResponse<GetPackagingResponse>> {
    const response = await baseFetch.get(
      this.urls.get.replace("{{packagingId}}", packagingId)
    );
    return response.data;
  }

  async listPackaging(): Promise<IBaseFetchResponse<GetPackagingResponse[]>> {
    const response = await baseFetch.get(this.urls.list);
    return response.data;
  }

  async regenerateItem(
    packagingId: string,
    item: PackagingItem,
    data: {
      script: string;
      title?: string;
      duration?: number;
    }
  ): Promise<IBaseFetchResponse<RegenerateItemResponse>> {
    const response = await baseFetch.post(
      this.urls.regenerateItem
        .replace("{{packagingId}}", packagingId)
        .replace("{{item}}", item),
      data
    );
    return response.data;
  }

  async submitFeedback(
    packagingId: string,
    item: PackagingItem,
    feedback: FeedbackValue
  ): Promise<
    IBaseFetchResponse<{
      id: string;
      item: PackagingItem;
      feedback: FeedbackValue;
    }>
  > {
    const response = await baseFetch.patch(
      this.urls.feedback.replace("{{packagingId}}", packagingId),
      { item, feedback }
    );
    return response.data;
  }

  async exportPackaging(
    packagingId: string
  ): Promise<IBaseFetchResponse<{ text: string }>> {
    const response = await baseFetch.get(
      this.urls.export.replace("{{packagingId}}", packagingId)
    );
    return response.data;
  }
}

export const packagingService = new PackagingService();

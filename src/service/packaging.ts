import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  GenerateTitleResponse,
  GenerateDescriptionResponse,
  GenerateThumbnailResponse,
  GenerateShortsResponse,
  SavePackagingResponse,
  GetPackagingResponse,
  RegenerateItemResponse,
  ITitle,
  ITimestampedSegment,
} from "@/types/feature/packaging";

type PackagingItem = "title" | "description" | "thumbnail" | "shorts";

const URLS = {
  generateTitle: "/v1/packaging/generate-title",
  generateDescription: "/v1/packaging/generate-description",
  generateThumbnail: "/v1/packaging/generate-thumbnail",
  generateShorts: "/v1/packaging/generate-shorts",
  save: "/v1/packaging/save",
  list: "/v1/packaging/list",
  get: "/v1/packaging/{{packagingId}}",
  regenerateItem: "/v1/packaging/{{packagingId}}/regenerate/{{item}}",
  selectTitle: "/v1/packaging/{{packagingId}}/select-title",
  export: "/v1/packaging/{{packagingId}}/export",
};

class PackagingService {
  private urls;

  constructor() {
    this.urls = URLS;
  }

  // Script, selected hook, and channel context are all resolved server-side
  // from the project — the client sends only `videoProjectId`, never the
  // script text itself.
  async generateTitle(
    videoProjectId: string
  ): Promise<IBaseFetchResponse<GenerateTitleResponse>> {
    const response = await baseFetch.post(this.urls.generateTitle, {
      videoProjectId,
    });
    return response.data;
  }

  async generateDescription(
    title: string,
    videoProjectId: string
  ): Promise<IBaseFetchResponse<GenerateDescriptionResponse>> {
    const response = await baseFetch.post(this.urls.generateDescription, {
      title,
      videoProjectId,
    });
    return response.data;
  }

  async generateThumbnail(
    title: string,
    videoProjectId: string
  ): Promise<IBaseFetchResponse<GenerateThumbnailResponse>> {
    const response = await baseFetch.post(this.urls.generateThumbnail, {
      title,
      videoProjectId,
    });
    return response.data;
  }

  async generateShorts(
    videoProjectId: string,
    duration: number = 60
  ): Promise<IBaseFetchResponse<GenerateShortsResponse>> {
    const response = await baseFetch.post(this.urls.generateShorts, {
      duration,
      videoProjectId,
    });
    return response.data;
  }

  async generateTitleDependentContent(
    videoProjectId: string,
    duration: number = 60
  ): Promise<{
    title: GenerateTitleResponse;
    description: GenerateDescriptionResponse;
    thumbnail: GenerateThumbnailResponse;
    shorts: GenerateShortsResponse;
  }> {
    // First, get titles (returns array of 3)
    const titleResponse = await this.generateTitle(videoProjectId);
    // Use the first title for dependent content generation
    const titleText = titleResponse?.data?.titles?.[0]?.title ?? "";

    // Then call description, thumbnail, and shorts in parallel with the title
    const [description, thumbnail, shorts] = await Promise.all([
      this.generateDescription(titleText, videoProjectId),
      this.generateThumbnail(titleText, videoProjectId),
      this.generateShorts(videoProjectId, duration),
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
    titles: ITitle[];
    selectedTitleIndex: number;
    description: string;
    thumbnail: string[];
    selectedThumbnailIndex: number;
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

  // Script resolves server-side from the project stored on the packaging doc;
  // shorts duration defaults server-side too.
  async regenerateItem(
    packagingId: string,
    item: PackagingItem,
    data: {
      title?: string;
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

  // §7.3: finalize a title — the server persists the choice and renames the project.
  async selectTitle(
    packagingId: string,
    index: number
  ): Promise<
    IBaseFetchResponse<{ id: string; selectedTitleIndex: number; title: string }>
  > {
    const response = await baseFetch.post(
      this.urls.selectTitle.replace("{{packagingId}}", packagingId),
      { index }
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

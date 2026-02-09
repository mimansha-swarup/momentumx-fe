import { baseFetch } from "@/utils/network";
import {
  GenerateTitleResponse,
  GenerateDescriptionResponse,
  GenerateThumbnailResponse,
  GenerateHooksResponse,
  GenerateShortsResponse,
  SavePackagingResponse,
  GetPackagingResponse,
  IHooks,
  ITimestampedSegment,
} from "@/types/feature/packaging";

const URLS = {
  generateTitle: "/v1/packaging/generate-title",
  generateDescription: "/v1/packaging/generate-description",
  generateThumbnail: "/v1/packaging/generate-thumbnail",
  generateHooks: "/v1/packaging/generate-hooks",
  generateShorts: "/v1/packaging/generate-shorts",
  save: "/v1/packaging/save",
  get: "/v1/packaging/{{packagingId}}",
};

class PackagingService {
  private urls;

  constructor() {
    this.urls = URLS;
  }

  async generateTitle(script: string): Promise<GenerateTitleResponse> {
    const response = await baseFetch.post(this.urls.generateTitle, { script });
    return response.data;
  }

  async generateDescription(
    script: string,
    title?: string
  ): Promise<GenerateDescriptionResponse> {
    const response = await baseFetch.post(this.urls.generateDescription, {
      script,
      title,
    });
    return response.data;
  }

  async generateThumbnail(
    script: string,
    title?: string
  ): Promise<GenerateThumbnailResponse> {
    const response = await baseFetch.post(this.urls.generateThumbnail, {
      script,
      title,
    });
    return response.data;
  }

  async generateHooks(script: string): Promise<GenerateHooksResponse> {
    const response = await baseFetch.post(this.urls.generateHooks, { script });
    return response.data;
  }

  async generateShorts(
    script: string,
    title?: string,
    variant: number = 0,
    maxDuration: number = 60
  ): Promise<GenerateShortsResponse> {
    const response = await baseFetch.post(this.urls.generateShorts, {
      script,
      title,
      duration: maxDuration,
      variant,
    });
    return response.data;
  }

  async generateTitleDependentContent(
    script: string,
    variant: number = 0,
    maxDuration: number = 60
  ): Promise<{
    title: GenerateTitleResponse;
    description: GenerateDescriptionResponse;
    thumbnail: GenerateThumbnailResponse;
    shorts: GenerateShortsResponse;
  }> {
    // First, get the title
    const titleResponse = await this.generateTitle(script);
    const titleText = titleResponse?.data?.title;

    // Then call description, thumbnail, and shorts in parallel with the title
    const [description, thumbnail, shorts] = await Promise.all([
      this.generateDescription(script, titleText),
      this.generateThumbnail(script, titleText),
      this.generateShorts(script, titleText, variant, maxDuration),
    ]);

    return {
      title: titleResponse.data,
      description: description.data,
      thumbnail: thumbnail.data,
      shorts: shorts.data,
    };
  }

  async savePackaging(data: {
    script: string;
    title: string;
    description: string;
    thumbnailDescription: string;
    hooks: IHooks[];
    shortsScripts: Array<{ id: string; segments: ITimestampedSegment[] }>;
  }): Promise<SavePackagingResponse> {
    const response = await baseFetch.post(this.urls.save, data);
    return response.data;
  }

  async getPackaging(packagingId: string): Promise<GetPackagingResponse> {
    const response = await baseFetch.get(
      this.urls.get.replace("{{packagingId}}", packagingId)
    );
    return response.data;
  }
}

export const packagingService = new PackagingService();

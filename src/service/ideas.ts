import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import { IGeneratedIdea } from "@/types/components/dashboard";

interface IdeasCursor {
  createdAt: string;
  docId: string;
}

export interface IdeasListParams {
  limit?: number;
  createdAt?: string;
  docId?: string;
  searchText?: string;
  isScriptGenerated?: string;
}

export interface IdeasListResponse {
  meta: {
    nextCursor: IdeasCursor | null;
    hasNextPage: boolean;
  };
  lists: IGeneratedIdea[];
}

// Instant-first-idea (§5.1): a transient, not-yet-persisted channel context the
// client passes to generation so a contextless user sees ideas immediately.
// Every field optional; merged over the stored user record server-side.
export interface IIdeaContextOverride {
  niche?: string;
  targetAudience?: string;
  brandName?: string;
  topTitles?: string[];
}

const URLS = {
  list: "/v1/ideas",
  generate: "/v1/ideas/generate",
  editIdea: "/v1/ideas/edit/{{ideaId}}",
  regenerateAll: "/v1/ideas/regenerate-all",
  regenerateOne: "/v1/ideas/{{ideaId}}/regenerate",
  export: "/v1/ideas/export",
};

class IdeaService {
  private urls = URLS;

  generateIdeas = async (
    context?: IIdeaContextOverride
  ): Promise<IBaseFetchResponse<IdeasListResponse['lists']>> => {
    const response = await baseFetch.post(
      this.urls.generate,
      context ? { context } : undefined
    );
    return response.data;
  };

  async getGeneratedData(
    query?: IdeasListParams
  ): Promise<IBaseFetchResponse<IdeasListResponse>> {
    const response = await baseFetch.get(this.urls.list, {
      params: query,
    });
    return response.data;
  }

  async editIdea(ideaId: string, body: Record<string, unknown>): Promise<IBaseFetchResponse<IdeasListResponse['lists'][number]>> {
    const response = await baseFetch.patch(
      this.urls.editIdea.replace("{{ideaId}}", ideaId),
      body
    );
    return response.data;
  }

  async regenerateAll(): Promise<IBaseFetchResponse<IGeneratedIdea[]>> {
    const response = await baseFetch.post(this.urls.regenerateAll);
    return response.data;
  }

  async regenerateOne(
    ideaId: string
  ): Promise<IBaseFetchResponse<IGeneratedIdea>> {
    const response = await baseFetch.post(
      this.urls.regenerateOne.replace("{{ideaId}}", ideaId)
    );
    return response.data;
  }

  async exportIdeas(): Promise<
    IBaseFetchResponse<{ text: string; count: number }>
  > {
    const response = await baseFetch.get(this.urls.export);
    return response.data;
  }
}

export const ideaService = new IdeaService();

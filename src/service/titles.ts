import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import { IGeneratedTopic } from "@/types/components/dashboard";

type FeedbackValue = "like" | "dislike" | null;

interface TopicsCursor {
  createdAt: string;
  docId: string;
}

export interface TopicsListParams {
  limit?: number;
  createdAt?: string;
  docId?: string;
  searchText?: string;
  isScriptGenerated?: string;
}

export interface TopicsListResponse {
  meta: {
    nextCursor: TopicsCursor | null;
    hasNextPage: boolean;
  };
  lists: IGeneratedTopic[];
}

const URLS = {
  titles: "/v1/topics",
  generate: "/v1/topics/generate",
  editTitle: "/v1/topics/edit/{{titleId}}",
  regenerateAll: "/v1/topics/regenerate-all",
  regenerateOne: "/v1/topics/{{topicId}}/regenerate",
  feedback: "/v1/topics/{{topicId}}/feedback",
  export: "/v1/topics/export",
};

class TitleService {
  private urls = URLS;

  generateTitles = async (): Promise<IBaseFetchResponse<TopicsListResponse['lists']>> => {
    const response = await baseFetch.post(this.urls.generate);
    return response.data;
  };

  async getGeneratedData(
    query?: TopicsListParams
  ): Promise<IBaseFetchResponse<TopicsListResponse>> {
    const response = await baseFetch.get(this.urls.titles, {
      params: query,
    });
    return response.data;
  }

  async editTitle(titleId: string, body: Record<string, unknown>): Promise<IBaseFetchResponse<TopicsListResponse['lists'][number]>> {
    const response = await baseFetch.patch(
      this.urls.editTitle.replace("{{titleId}}", titleId),
      body
    );
    return response.data;
  }

  async regenerateAll(): Promise<IBaseFetchResponse<IGeneratedTopic[]>> {
    const response = await baseFetch.post(this.urls.regenerateAll);
    return response.data;
  }

  async regenerateOne(
    topicId: string
  ): Promise<IBaseFetchResponse<IGeneratedTopic>> {
    const response = await baseFetch.post(
      this.urls.regenerateOne.replace("{{topicId}}", topicId)
    );
    return response.data;
  }

  async submitFeedback(
    topicId: string,
    feedback: FeedbackValue
  ): Promise<IBaseFetchResponse<{ id: string; userFeedback: FeedbackValue }>> {
    const response = await baseFetch.patch(
      this.urls.feedback.replace("{{topicId}}", topicId),
      { feedback }
    );
    return response.data;
  }

  async exportTopics(): Promise<
    IBaseFetchResponse<{ text: string; count: number }>
  > {
    const response = await baseFetch.get(this.urls.export);
    return response.data;
  }
}

export const titleService = new TitleService();

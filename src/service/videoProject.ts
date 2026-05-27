import { baseFetch, IBaseFetchResponse } from "@/utils/network";
import {
  IVideoProject,
  IStepTransitionResponse,
  ListProjectsParams,
  ListProjectsResponse,
  IVideoProjectListItem,
  ResourceType,
} from "@/types/feature/videoProject";

const URLS = {
  projects: "/v1/video-projects",
  project: "/v1/video-projects/{projectId}",
  stepStart: "/v1/video-projects/{projectId}/step/{stepName}/start",
  stepComplete: "/v1/video-projects/{projectId}/step/{stepName}/complete",
  linkResource: "/v1/video-projects/{projectId}/link/{resourceType}",
};

class VideoProjectService {
  private urls = URLS;

  async createProject(
    topicId: string
  ): Promise<IBaseFetchResponse<IVideoProject>> {
    const response = await baseFetch.post(this.urls.projects, { topicId });
    return response.data;
  }

  async listProjects(
    params?: ListProjectsParams
  ): Promise<IBaseFetchResponse<ListProjectsResponse>> {
    const response = await baseFetch.get(this.urls.projects, { params });
    return response.data;
  }

  async getProject(
    projectId: string
  ): Promise<IBaseFetchResponse<IVideoProject>> {
    const response = await baseFetch.get(
      this.urls.project.replace("{projectId}", projectId)
    );
    return response.data;
  }

  async updateWorkingTitle(
    projectId: string,
    workingTitle: string
  ): Promise<IBaseFetchResponse<Partial<IVideoProjectListItem>>> {
    const response = await baseFetch.patch(
      this.urls.project.replace("{projectId}", projectId),
      { workingTitle }
    );
    return response.data;
  }

  async deleteProject(
    projectId: string
  ): Promise<IBaseFetchResponse<{ id: string; isDeleted: boolean; deletedAt: string }>> {
    const response = await baseFetch.delete(
      this.urls.project.replace("{projectId}", projectId)
    );
    return response.data;
  }

  async startStep(
    projectId: string,
    stepName: string
  ): Promise<IBaseFetchResponse<IStepTransitionResponse>> {
    const response = await baseFetch.patch(
      this.urls.stepStart
        .replace("{projectId}", projectId)
        .replace("{stepName}", stepName)
    );
    return response.data;
  }

  async completeStep(
    projectId: string,
    stepName: string
  ): Promise<IBaseFetchResponse<IStepTransitionResponse>> {
    const response = await baseFetch.patch(
      this.urls.stepComplete
        .replace("{projectId}", projectId)
        .replace("{stepName}", stepName)
    );
    return response.data;
  }

  async linkResource(
    projectId: string,
    resourceType: ResourceType,
    resourceId: string
  ): Promise<IBaseFetchResponse<Partial<IVideoProject>>> {
    const response = await baseFetch.patch(
      this.urls.linkResource
        .replace("{projectId}", projectId)
        .replace("{resourceType}", resourceType),
      { resourceId }
    );
    return response.data;
  }
}

export const videoProjectService = new VideoProjectService();

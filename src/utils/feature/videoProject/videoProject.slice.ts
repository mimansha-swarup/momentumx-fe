import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/utils/store";
import { IVideoProjectState, IPipelineStep, StepName, StepStatus } from "@/types/feature/videoProject";
import {
  createProject,
  listProjects,
  getProject,
  updateWorkingTitle,
  deleteProject,
  startStep,
  completeStep,
  linkResource,
} from "./videoProject.thunk";

const initialState: IVideoProjectState = {
  projects: [],
  hasMore: false,
  nextCursor: null,
  isLoading: false,
  error: null,

  currentProject: null,
  isLoadingProject: false,
  projectError: null,

  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isStepTransitioning: false,
  isLinkingResource: false,
};

const videoProjectSlice = createSlice({
  name: "videoProject",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.projectError = null;
    },
    clearProjects: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.projectError = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload) {
          state.projects.unshift({
            id: action.payload.id,
            workingTitle: action.payload.workingTitle,
            currentStep: action.payload.currentStep,
            overallStatus: action.payload.overallStatus,
            lastUpdatedAt: action.payload.lastUpdatedAt,
            createdAt: action.payload.createdAt,
            thumbnailHint: null,
          });
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isCreating = false;
        state.projectError = action.payload as string;
      })

      // List Projects — append on cursor (pagination), replace on first page
      .addCase(listProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data) {
          const hasCursor = !!action.payload.params?.cursor;
          if (hasCursor) {
            state.projects = [
              ...state.projects,
              ...action.payload.data.projects,
            ];
          } else {
            state.projects = action.payload.data.projects;
          }
          state.hasMore = action.payload.data.hasMore;
          state.nextCursor = action.payload.data.nextCursor;
        }
      })
      .addCase(listProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Project
      .addCase(getProject.pending, (state) => {
        state.isLoadingProject = true;
        state.projectError = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoadingProject = false;
        state.currentProject = action.payload ?? null;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoadingProject = false;
        state.projectError = action.payload as string;
      })

      // Update Working Title
      .addCase(updateWorkingTitle.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateWorkingTitle.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { projectId, workingTitle } = action.meta.arg;
        const project = state.projects.find((p) => p.id === projectId);
        if (project) {
          project.workingTitle = workingTitle;
        }
        if (state.currentProject?.id === projectId) {
          state.currentProject.workingTitle = workingTitle;
        }
      })
      .addCase(updateWorkingTitle.rejected, (state, action) => {
        state.isUpdating = false;
        state.projectError = action.payload as string;
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isDeleting = false;
        if (action.payload?.id) {
          state.projects = state.projects.filter(
            (p) => p.id !== action.payload?.id
          );
          if (state.currentProject?.id === action.payload.id) {
            state.currentProject = null;
          }
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // Start Step — deep merge: only update the returned pipeline step(s)
      .addCase(startStep.pending, (state) => {
        state.isStepTransitioning = true;
      })
      .addCase(startStep.fulfilled, (state, action) => {
        state.isStepTransitioning = false;
        if (state.currentProject && action.payload) {
          state.currentProject.currentStep = action.payload.currentStep;
          state.currentProject.lastUpdatedAt = action.payload.lastUpdatedAt;
          if (action.payload.overallStatus) {
            state.currentProject.overallStatus = action.payload.overallStatus;
          }
          for (const [stepName, stepData] of Object.entries(
            action.payload.pipeline
          )) {
            if (stepData) {
              state.currentProject.pipeline[stepName as StepName] = stepData;
            }
          }
        }
      })
      .addCase(startStep.rejected, (state, action) => {
        state.isStepTransitioning = false;
        state.projectError = action.payload as string;
      })

      // Complete Step — deep merge: only update the returned pipeline step(s)
      .addCase(completeStep.pending, (state) => {
        state.isStepTransitioning = true;
      })
      .addCase(completeStep.fulfilled, (state, action) => {
        state.isStepTransitioning = false;
        if (state.currentProject && action.payload) {
          state.currentProject.currentStep = action.payload.currentStep;
          state.currentProject.lastUpdatedAt = action.payload.lastUpdatedAt;
          if (action.payload.overallStatus) {
            state.currentProject.overallStatus = action.payload.overallStatus;
          }
          for (const [stepName, stepData] of Object.entries(
            action.payload.pipeline
          )) {
            if (stepData) {
              state.currentProject.pipeline[stepName as StepName] = stepData;
            }
          }
        }
      })
      .addCase(completeStep.rejected, (state, action) => {
        state.isStepTransitioning = false;
        state.projectError = action.payload as string;
      })

      // Link Resource
      .addCase(linkResource.pending, (state) => {
        state.isLinkingResource = true;
      })
      .addCase(linkResource.fulfilled, (state, action) => {
        state.isLinkingResource = false;
        if (state.currentProject && action.payload) {
          const payload = action.payload;
          // Explicitly assign each known top-level field from Partial<IVideoProject>
          if (payload.scriptId !== undefined) {
            state.currentProject.scriptId = payload.scriptId;
          }
          if (payload.hooksId !== undefined) {
            state.currentProject.hooksId = payload.hooksId;
          }
          if (payload.packagingId !== undefined) {
            state.currentProject.packagingId = payload.packagingId;
          }
          if (payload.selectedHookIndex !== undefined) {
            state.currentProject.selectedHookIndex = payload.selectedHookIndex;
          }
          if (payload.currentStep !== undefined) {
            state.currentProject.currentStep = payload.currentStep;
          }
          if (payload.overallStatus !== undefined) {
            state.currentProject.overallStatus = payload.overallStatus;
          }
          if (payload.workingTitle !== undefined) {
            state.currentProject.workingTitle = payload.workingTitle;
          }
          if (payload.lastUpdatedAt !== undefined) {
            state.currentProject.lastUpdatedAt = payload.lastUpdatedAt;
          }
          // Deep merge pipeline steps if present
          if (payload.pipeline) {
            for (const [stepName, stepData] of Object.entries(payload.pipeline)) {
              if (stepData) {
                state.currentProject.pipeline[stepName as StepName] = stepData as IPipelineStep;
              }
            }
          }
        }
      })
      .addCase(linkResource.rejected, (state, action) => {
        state.isLinkingResource = false;
        state.projectError = action.payload as string;
      });
  },
});

export const { clearCurrentProject, clearProjects } =
  videoProjectSlice.actions;

// Selectors
export const selectProjects = (state: RootState) =>
  state.videoProject.projects;
export const selectProjectsLoading = (state: RootState) =>
  state.videoProject.isLoading;
export const selectHasMoreProjects = (state: RootState) =>
  state.videoProject.hasMore;
export const selectNextCursor = (state: RootState) =>
  state.videoProject.nextCursor;
export const selectCurrentProject = (state: RootState) =>
  state.videoProject.currentProject;
export const selectProjectLoading = (state: RootState) =>
  state.videoProject.isLoadingProject;
export const selectIsCreating = (state: RootState) =>
  state.videoProject.isCreating;
export const selectIsStepTransitioning = (state: RootState) =>
  state.videoProject.isStepTransitioning;
export const selectError = (state: RootState) =>
  state.videoProject.error;
export const selectProjectError = (state: RootState) =>
  state.videoProject.projectError;
export const selectIsUpdating = (state: RootState) =>
  state.videoProject.isUpdating;
export const selectIsDeleting = (state: RootState) =>
  state.videoProject.isDeleting;
export const selectIsLinkingResource = (state: RootState) =>
  state.videoProject.isLinkingResource;

// Pre-built per-step selectors — avoids new function references on every render.
// Usage: useAppSelector(selectStepStatus.script)
export const selectPipeline = (state: RootState) =>
  state.videoProject.currentProject?.pipeline;

export const selectStepStatus: Record<StepName, (state: RootState) => StepStatus> = {
  research: createSelector(selectPipeline, (p): StepStatus => p?.research?.status ?? "not_started"),
  script: createSelector(selectPipeline, (p): StepStatus => p?.script?.status ?? "not_started"),
  hooks: createSelector(selectPipeline, (p): StepStatus => p?.hooks?.status ?? "not_started"),
  packaging: createSelector(selectPipeline, (p): StepStatus => p?.packaging?.status ?? "not_started"),
};

export const selectIsStepStale: Record<StepName, (state: RootState) => boolean> = {
  research: createSelector(selectPipeline, (p) => p?.research?.status === "stale"),
  script: createSelector(selectPipeline, (p) => p?.script?.status === "stale"),
  hooks: createSelector(selectPipeline, (p) => p?.hooks?.status === "stale"),
  packaging: createSelector(selectPipeline, (p) => p?.packaging?.status === "stale"),
};

export default videoProjectSlice.reducer;

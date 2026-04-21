import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Loader2,
  RefreshCw,
  Download,
  AlertCircle,
  Play,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectCurrentProject,
  selectIsStepStale,
} from "@/utils/feature/videoProject/videoProject.slice";
import {
  getProject,
  startStep,
  completeStep,
} from "@/utils/feature/videoProject/videoProject.thunk";
import {
  selectHooksBatch,
  selectHooksLoading,
  selectHooksRegenerating,
  selectSelectedHookIndex,
  selectHooksError,
  selectIsExporting,
  selectIsSubmittingFeedback,
  selectIsSelecting,
  clearError,
  hydrateSelectedIndex,
} from "@/utils/feature/hooks/hooks.slice";
import {
  generateHooks,
  selectHook,
  regenerateHooks,
  submitHookFeedback,
  exportHooks,
} from "@/utils/feature/hooks/hooks.thunk";
import { selectCurrentScript } from "@/utils/feature/scripts/script.slice";
import { getScriptById } from "@/utils/feature/scripts/script.thunk";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/shared/glassCard";
import { StaleStepBanner } from "@/components/project";
import { HooksList } from "@/components/hooks";
import type { FeedbackValue } from "@/types/feature/hooks";

const ProjectHooksPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const project = useAppSelector(selectCurrentProject);
  const isStale = useAppSelector(selectIsStepStale.hooks);
  const batch = useAppSelector(selectHooksBatch);
  const isLoading = useAppSelector(selectHooksLoading);
  const isRegenerating = useAppSelector(selectHooksRegenerating);
  const selectedIndex = useAppSelector(selectSelectedHookIndex);
  const error = useAppSelector(selectHooksError);
  const isExporting = useAppSelector(selectIsExporting);
  const isSubmittingFeedback = useAppSelector(selectIsSubmittingFeedback);
  const isSelecting = useAppSelector(selectIsSelecting);
  const currentScript = useAppSelector(selectCurrentScript);

  const projectId = project?.id ?? "";
  // Use cached batch only if it belongs to this project; fall back to server-side hooksId
  const batchIdForProject = batch?.videoProjectId === projectId ? batch?.id : null;
  const hooksId = batchIdForProject ?? project?.hooksId ?? "";
  const hasHooks = !!batch?.hooks?.length;
  const scriptText = currentScript?.script ?? "";

  // Effect 1 — Hydrate selectedHookIndex from project on mount
  useEffect(() => {
    if (project?.selectedHookIndex != null) {
      dispatch(hydrateSelectedIndex(project.selectedHookIndex));
    }
  }, [project?.selectedHookIndex, dispatch]);

  // Effect 2 — Load script if not already loaded (needed for generate/regenerate)
  useEffect(() => {
    const scriptId = project?.topicId;
    if (scriptId && !currentScript) {
      dispatch(getScriptById(scriptId));
    }
  }, [project?.topicId, currentScript, dispatch]);

  // Effect 3 — Cleanup on unmount (do NOT clear batch — cache it per 6f)
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!projectId || !scriptText) return;
    dispatch(clearError());
    // Mark pipeline step as in_progress before generating
    const stepResult = await dispatch(startStep({ projectId, stepName: "hooks" }));
    if (startStep.rejected.match(stepResult)) return;
    await dispatch(
      generateHooks({ videoProjectId: projectId, script: scriptText })
    );
    // Re-fetch project in both cases to keep pipeline state in sync
    dispatch(getProject(projectId));
  };

  const handleSelect = async (hookIndex: number) => {
    if (!hooksId || !projectId || isSelecting) return;
    const result = await dispatch(
      selectHook({ hooksId, hookIndex, videoProjectId: projectId })
    );
    if (selectHook.fulfilled.match(result)) {
      await dispatch(getProject(projectId));
      navigate(`/app/project/${projectId}/packaging`);
    }
  };

  const handleRegenerate = async () => {
    if (!hooksId || !scriptText || isRegenerating) return;
    dispatch(clearError());
    const result = await dispatch(regenerateHooks({ hooksId, script: scriptText }));
    if (regenerateHooks.fulfilled.match(result)) {
      dispatch(getProject(projectId));
    }
  };

  const handleKeepAsIs = async () => {
    if (!projectId) return;
    const result = await dispatch(completeStep({ projectId, stepName: "hooks" }));
    if (completeStep.fulfilled.match(result)) {
      dispatch(getProject(projectId));
    }
  };

  const handleFeedback = (_id: string, feedback: FeedbackValue) => {
    const hookIndex = parseInt(_id, 10);
    if (!hooksId || isNaN(hookIndex)) return;
    dispatch(submitHookFeedback({ hooksId, hookIndex, feedback }));
  };

  const handleExport = () => {
    if (!hooksId) return;
    dispatch(exportHooks(hooksId));
  };

  if (!project) return null;

  // Empty state — hooks were generated before but batch is not cached (revisit after refresh)
  // Handles its own error inline so regenerate failures stay in context
  if (!hasHooks && !isLoading && project.hooksId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="icon-container mb-2">
          <Anchor className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-title text-xl">Hooks Previously Generated</h2>
        <p className="text-label max-w-md">
          Hooks were previously generated.
          {project.selectedHookIndex != null && (
            <> Hook {project.selectedHookIndex + 1} was selected.</>
          )}
        </p>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating || !scriptText || !hooksId}
          className="btn-primary-glow px-6 py-2.5 rounded-lg"
        >
          {isRegenerating ? (
            <Loader2
              className="size-4 mr-2 motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <RefreshCw className="size-4 mr-2" aria-hidden="true" />
          )}
          Regenerate Hooks
        </Button>
      </div>
    );
  }

  // Error state — only for non-cache-miss load-phase errors
  if (error && !hasHooks && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            dispatch(clearError());
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state — no hooks generated yet
  if (!hasHooks && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="icon-container mb-4">
          <Anchor className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-title text-xl mb-2">Generate Your Hooks</h2>
        <p className="text-label max-w-md mb-6">
          Generate compelling hooks for your video to grab your audience's
          attention in the first few seconds.
        </p>
        {!scriptText && (
          <p className="text-sm text-muted-foreground mb-4">
            Script is required to generate hooks.
          </p>
        )}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !scriptText}
          className="btn-primary-glow px-6 py-2.5 rounded-lg"
        >
          <Play className="size-4 mr-2" aria-hidden="true" />
          Generate Hooks
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading && !hasHooks) {
    return (
      <div className="space-y-4" role="status" aria-label="Generating hooks">
        <div className="flex items-center gap-2 text-primary">
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Generating hooks...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <GlassCard key={i}>
              <div className="flex flex-col gap-3">
                <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-3/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-full h-3 bg-accent-foreground/25" />
                <Skeleton className="w-2/5 h-3 bg-accent-foreground/25" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // Loaded state — hooks exist
  return (
    <div className="space-y-4">
      {/* Stale banner */}
      {isStale && (
        <StaleStepBanner
          staleReason="script_regenerated"
          onRegenerate={handleRegenerate}
          onKeepAsIs={handleKeepAsIs}
          isRegenerating={isRegenerating}
        />
      )}

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-title text-lg">Hooks</h2>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExporting ? (
              <Loader2
                className="size-4 mr-1.5 motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Download className="size-4 mr-1.5" aria-hidden="true" />
            )}
            Export
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating || !hooksId}
            className="text-muted-foreground hover:text-foreground"
          >
            {isRegenerating ? (
              <Loader2
                className="size-4 mr-1.5 motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <RefreshCw className="size-4 mr-1.5" aria-hidden="true" />
            )}
            Regenerate
          </Button>
        </div>
      </div>

      {/* Inline error for selection/mutation failures */}
      {error && (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      )}

      {/* Hooks list */}
      <HooksList
        hooks={batch?.hooks ?? []}
        batchId={batch?.id ?? ""}
        selectedHookIndex={selectedIndex}
        hookFeedback={batch?.hookFeedback ?? {}}
        onSelect={handleSelect}
        onFeedback={(index, feedback) =>
          handleFeedback(String(index), feedback)
        }
        isSelecting={isSelecting}
        isSubmittingFeedback={isSubmittingFeedback}
      />

      {/* Selection status */}
      {selectedIndex != null && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Hook {selectedIndex + 1} is selected. Select a different hook or
          proceed to packaging.
        </p>
      )}
    </div>
  );
};

export default ProjectHooksPage;

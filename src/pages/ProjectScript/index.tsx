import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  RefreshCw,
  Download,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectCurrentProject,
  selectIsStepStale,
} from "@/utils/feature/videoProject/videoProject.slice";
import {
  getProject,
  completeStep,
} from "@/utils/feature/videoProject/videoProject.thunk";
import {
  editScript,
  exportScript,
  getScriptById,
  regenerateScript,
} from "@/utils/feature/scripts/script.thunk";
import {
  selectScriptsIsRegenerating,
  selectScriptsIsExporting,
  selectScriptsIsEditing,
  selectScriptsError,
  selectCurrentScript,
  selectIsLoadingCurrentScript,
  clearCurrentScript,
  clearError,
} from "@/utils/feature/scripts/script.slice";
import { useScriptStream } from "@/hooks/useScriptStream";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/shared/glassCard";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import MyEditor from "@/components/shared/Editor";
import { StaleStepBanner } from "@/components/project";
import { htmlToMarkdown } from "@/utils/markdown";

const ProjectScriptPage = () => {
  const dispatch = useAppDispatch();

  const project = useAppSelector(selectCurrentProject);
  const isStale = useAppSelector(selectIsStepStale.script);
  const isRegenerating = useAppSelector(selectScriptsIsRegenerating);
  const isExporting = useAppSelector(selectScriptsIsExporting);
  const isEditing = useAppSelector(selectScriptsIsEditing);
  const sliceError = useAppSelector(selectScriptsError);
  const currentScript = useAppSelector(selectCurrentScript);
  const isLoadingScript = useAppSelector(selectIsLoadingCurrentScript);

  const [isEditMode, setIsEditMode] = useState(false);

  const scriptId = project?.scriptId ?? "";
  const hasScript = !!project?.scriptId;
  const projectId = project?.id ?? "";
  const navigate = useNavigate();

  const { streamContent, isStreaming, streamError, startStreaming, scrollSentinelRef } =
    useScriptStream({ projectId });

  // Effect 1 — Load existing script when one is available
  useEffect(() => {
    if (!projectId || !hasScript) return;
    dispatch(getScriptById(scriptId));
    return () => {
      dispatch(clearCurrentScript());
    };
  }, [projectId, hasScript, scriptId, dispatch]);

  // Effect 2 — Auto-start generation on arrival. The user already committed by
  // clicking "Use Idea"; a second "Generate" click is dead weight. Once per
  // mount — a failed stream lands on the error state, whose Retry re-triggers.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!projectId || hasScript || autoStartedRef.current) return;
    autoStartedRef.current = true;
    startStreaming();
  }, [projectId, hasScript, startStreaming]);

  const handleRegenerate = async () => {
    dispatch(clearError());
    const result = await dispatch(regenerateScript(scriptId));
    if (regenerateScript.fulfilled.match(result)) {
      // Re-fetch project — backend auto-triggers stale cascade on hooks/packaging
      dispatch(getProject(projectId));
      // Re-fetch full script to get updated metadata
      dispatch(getScriptById(scriptId));
    }
  };

  const handleKeepAsIs = () => {
    // Backend allows stale → completed transition
    dispatch(completeStep({ projectId, stepName: "script" }));
  };

  const handleExport = () => {
    dispatch(exportScript(scriptId));
  };

  const handleSaveEdit = async (htmlContent: string) => {
    const markdown = htmlToMarkdown(htmlContent);
    const result = await dispatch(editScript({ scriptId, script: markdown }));
    if (editScript.fulfilled.match(result)) {
      setIsEditMode(false);
    }
  };

  if (!project) return null;

  // Only show the error fallback for load-phase errors (not export/feedback failures)
  const isLoadError = (sliceError || streamError) && !currentScript && !isStreaming;

  // Error state
  if (isLoadError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
        <p className="text-destructive">
          {sliceError ?? "Script streaming failed. Please try again."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            dispatch(clearError());
            if (hasScript) {
              dispatch(getScriptById(scriptId));
            } else {
              // Stream failed before any script was saved — retry generation
              startStreaming();
            }
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Generation in flight — covers both live streaming and the post-stream window
  // where the persisted script hasn't loaded yet (getProject → getScriptById in
  // flight). Keeping the streamed content up means the page never flashes blank.
  if (isStreaming || (streamContent && !currentScript)) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          aria-live="polite"
          aria-busy={isStreaming}
          className="flex items-center gap-2 text-primary"
        >
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">
            {isStreaming ? (
              <>
                Writing your script from &ldquo;{project.title}&rdquo; &mdash;
                takes about a minute
              </>
            ) : (
              <>Finalizing script&hellip;</>
            )}
          </span>
        </div>
        <GlassCard>
          <div className="min-h-40">
            {streamContent ? (
              <>
                <MarkdownPreview content={streamContent} />
                <div ref={scrollSentinelRef} />
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Skeleton className="w-3/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-2/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-3/4 h-3 bg-accent-foreground/25" />
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  // Loading state
  if (isLoadingScript && !currentScript) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading script">
        <h2 className="text-title text-lg">Script</h2>
        <GlassCard>
          <div className="flex flex-col gap-3">
            <Skeleton className="w-3/5 h-3 bg-accent-foreground/25" />
            <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
            <Skeleton className="w-2/5 h-3 bg-accent-foreground/25" />
            <Skeleton className="w-3/4 h-3 bg-accent-foreground/25" />
            <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
            <Skeleton className="w-1/3 h-3 bg-accent-foreground/25" />
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!currentScript) return null;

  // Loaded state — script exists
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
        <h2 className="text-title text-lg">Script</h2>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditMode(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-4 mr-1.5" aria-hidden="true" />
              Edit
            </Button>
          )}

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
            disabled={isRegenerating}
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

          {/* Simple next-step CTA — keeps the pipeline functional (Script → Hooks) */}
          <Button
            size="sm"
            className="btn-primary-glow"
            onClick={() => navigate(`/app/project/${projectId}/hooks`)}
          >
            Continue to Hooks
            <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Script content */}
      {isEditMode ? (
        <MyEditor
          toEditText={currentScript.script}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditMode(false)}
          loading={isEditing}
        />
      ) : (
        <GlassCard>
          <div aria-busy={isRegenerating} aria-live="polite">
            <MarkdownPreview content={currentScript.script} />
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ProjectScriptPage;

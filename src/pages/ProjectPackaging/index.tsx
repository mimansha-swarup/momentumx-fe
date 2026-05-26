import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Loader2,
  Download,
  AlertCircle,
  Play,
  Save,
  RefreshCw,
  FileText,
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
  selectTitles,
  selectDescription,
  selectThumbnails,
  selectShortsScripts,
  selectCanAddMoreShorts,
  selectIsSaving,
  selectIsGeneratingAll,
  selectCurrentPackaging,
  selectIsDetailLoading,
  selectIsRegeneratingItem,
  selectIsExporting,
  selectPackagingError,
  selectHasContent,
  selectItemFeedback,
  setSelectedTitle,
  updateTitleVariation,
  updateDescription,
  setSelectedThumbnail,
  deleteShortsScript,
  resetPackaging,
  clearErrors,
  setScript,
  hydrateFromResponse,
} from "@/utils/feature/packaging/packaging.slice";
import {
  generateAllPackagingForProject,
  savePackaging,
  getPackaging,
  regenerateItem,
  exportPackaging,
  addNewShortsScript,
  regenerateShortsScript,
  generateTitle,
  generateDescription,
  generateThumbnail,
  submitPackagingFeedback,
} from "@/utils/feature/packaging/packaging.thunk";
import { selectCurrentScript } from "@/utils/feature/scripts/script.slice";
import { getScriptById } from "@/utils/feature/scripts/script.thunk";
import {
  selectHooksBatch,
  selectSelectedHookIndex,
} from "@/utils/feature/hooks/hooks.slice";
import {
  TitlesCard,
  OutputCard,
  ThumbnailsCard,
  ShortsScriptCard,
  ItemStaleIndicator,
  CompletionCelebration,
  ScriptPreview,
} from "@/components/packaging";
import { StaleStepBanner } from "@/components/project";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/shared/glassCard";
import { PACKAGING_LIMITS, PackagingItemName } from "@/types/feature/packaging";

const ProjectPackagingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const project = useAppSelector(selectCurrentProject);
  const isStale = useAppSelector(selectIsStepStale.packaging);
  const titles = useAppSelector(selectTitles);
  const description = useAppSelector(selectDescription);
  const thumbnails = useAppSelector(selectThumbnails);
  const shortsScript = useAppSelector(selectShortsScripts);
  const canAddMoreShorts = useAppSelector(selectCanAddMoreShorts);
  const isSaving = useAppSelector(selectIsSaving);
  const isGeneratingAll = useAppSelector(selectIsGeneratingAll);
  const currentPackaging = useAppSelector(selectCurrentPackaging);
  const isDetailLoading = useAppSelector(selectIsDetailLoading);
  const isRegeneratingItem = useAppSelector(selectIsRegeneratingItem);
  const isExporting = useAppSelector(selectIsExporting);
  const error = useAppSelector(selectPackagingError);
  const hasContent = useAppSelector(selectHasContent);
  const currentScript = useAppSelector(selectCurrentScript);
  const hooksBatch = useAppSelector(selectHooksBatch);
  const selectedHookIndex = useAppSelector(selectSelectedHookIndex);
  const itemFeedback = useAppSelector(selectItemFeedback);

  const projectId = project?.id ?? "";
  const packagingId = currentPackaging?.id ?? project?.packagingId ?? "";
  const scriptText = currentScript?.script ?? "";
  const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? "";
  const hookIndex = selectedHookIndex ?? project?.selectedHookIndex;
  const selectedHookText =
    hookIndex != null ? (hooksBatch?.hooks?.[hookIndex] ?? "") : "";

  // Effect 1 — Load script if not cached
  useEffect(() => {
    const scriptId = project?.topicId;
    if (scriptId && !currentScript) {
      dispatch(getScriptById(scriptId));
    }
  }, [project?.topicId, currentScript, dispatch]);

  // Effect 2 — Load existing packaging if available
  useEffect(() => {
    if (project?.packagingId && !currentPackaging) {
      dispatch(getPackaging(project.packagingId));
    }
  }, [project?.packagingId, currentPackaging, dispatch]);

  // Effect 3 — Hydrate working fields from loaded packaging
  useEffect(() => {
    if (currentPackaging) {
      dispatch(hydrateFromResponse(currentPackaging));
    }
  }, [currentPackaging, dispatch]);

  // Effect 4 — Set script in packaging state (needed by standalone thunks that read from state.packaging.script)
  useEffect(() => {
    if (scriptText) {
      dispatch(setScript(scriptText));
    }
  }, [scriptText, dispatch]);

  // Mounted ref for abort on unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Effect 5 — Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetPackaging());
    };
  }, [dispatch]);

  const handleGenerateAll = async () => {
    if (!projectId || !scriptText || isGeneratingAll) return;
    dispatch(clearErrors());
    const stepResult = await dispatch(
      startStep({ projectId, stepName: "packaging" })
    );
    if (startStep.rejected.match(stepResult)) return;
    await dispatch(
      generateAllPackagingForProject({
        script: scriptText,
        selectedHook: selectedHookText || undefined,
      })
    );
    if (mountedRef.current) {
      dispatch(getProject(projectId));
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    const result = await dispatch(savePackaging(projectId));
    if (savePackaging.fulfilled.match(result)) {
      dispatch(getProject(projectId));
    }
  };

  const handleRegenerateItem = async (item: PackagingItemName) => {
    if (!packagingId || isRegeneratingItem) return;
    const result = await dispatch(
      regenerateItem({
        packagingId,
        item,
        script: scriptText,
        title: item !== "title" ? selectedTitle : undefined,
        selectedHook: selectedHookText || undefined,
      })
    );
    if (regenerateItem.fulfilled.match(result)) {
      dispatch(getPackaging(packagingId));
    }
  };

  const handleExport = () => {
    if (!packagingId) return;
    dispatch(exportPackaging(packagingId));
  };

  const handleKeepAsIs = async () => {
    if (!projectId) return;
    const result = await dispatch(
      completeStep({ projectId, stepName: "packaging" })
    );
    if (completeStep.fulfilled.match(result)) {
      dispatch(getProject(projectId));
    }
  };

  const handleRegenerateAllStale = async () => {
    if (!packagingId || !currentPackaging || isRegeneratingItem || isGeneratingAll) return;
    const staleItems = (
      Object.entries(currentPackaging?.itemStatuses ?? {}) as [
        PackagingItemName,
        string,
      ][]
    )
      .filter(([, status]) => status === "stale")
      .map(([item]) => item);

    for (const item of staleItems) {
      if (!mountedRef.current) return;
      const result = await dispatch(
        regenerateItem({
          packagingId,
          item,
          script: scriptText,
          title: item !== "title" ? selectedTitle : undefined,
          selectedHook: selectedHookText || undefined,
        })
      );
      if (regenerateItem.rejected.match(result)) break;
    }
    if (!mountedRef.current) return;
    dispatch(getPackaging(packagingId));
    dispatch(getProject(projectId));
  };

  const handleFeedback = (item: PackagingItemName, feedback: "like" | "dislike" | null) => {
    if (!packagingId) return;
    dispatch(submitPackagingFeedback({ packagingId, item, feedback }));
  };

  // Guard
  if (!project) return null;

  // Loading state — fetching existing packaging
  if (isDetailLoading && !hasContent) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading packaging">
        <div className="flex items-center gap-2 text-primary">
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Loading packaging...</span>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i}>
              <div className="flex flex-col gap-3 p-2">
                <Skeleton className="w-2/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-full h-3 bg-accent-foreground/25" />
                <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-3/5 h-3 bg-accent-foreground/25" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // Error state — load-phase errors only
  if (error && !hasContent && !isGeneratingAll) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            dispatch(clearErrors());
            if (project?.packagingId) {
              dispatch(getPackaging(project.packagingId));
            }
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state — no content generated yet
  if (!hasContent && !isGeneratingAll) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="icon-container mb-4">
          <Package className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-title text-xl mb-2">Generate Your Packaging</h2>
        <p className="text-label max-w-md mb-6">
          Generate titles, description, thumbnails, and shorts scripts from your
          video script and selected hook.
        </p>
        {!scriptText && (
          <p className="text-sm text-muted-foreground mb-4">
            Script is required to generate packaging.
          </p>
        )}
        <Button
          onClick={handleGenerateAll}
          disabled={!scriptText || isGeneratingAll}
          className="btn-primary-glow px-6 py-2.5 rounded-lg"
        >
          <Play className="size-4 mr-2" aria-hidden="true" />
          Generate All
        </Button>
      </div>
    );
  }

  // Generating state
  if (isGeneratingAll && !hasContent) {
    return (
      <div className="space-y-4" role="status" aria-label="Generating packaging">
        <div className="flex items-center gap-2 text-primary">
          <Loader2
            className="size-4 motion-safe:animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Generating packaging...</span>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i}>
              <div className="flex flex-col gap-3 p-2">
                <Skeleton className="w-2/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-full h-3 bg-accent-foreground/25" />
                <Skeleton className="w-4/5 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-3/5 h-3 bg-accent-foreground/25" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // Content state
  return (
    <div className="space-y-6">
      {/* Completion celebration */}
      {project.overallStatus === "completed" && (
        <CompletionCelebration
          projectTitle={project.workingTitle}
          onExport={handleExport}
          onBackToProjects={() => navigate("/app/dashboard")}
          isExporting={isExporting}
        />
      )}

      {/* Stale banner */}
      {isStale && (
        <StaleStepBanner
          staleReason={currentPackaging?.staleReason ?? "hooks_regenerated"}
          onRegenerate={handleRegenerateAllStale}
          onKeepAsIs={handleKeepAsIs}
          isRegenerating={isRegeneratingItem}
        />
      )}

      {/* Inline error */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Script preview */}
      <ScriptPreview script={scriptText} />

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-title text-lg">Packaging</h2>
        <div className="flex flex-wrap items-center gap-2">
          {packagingId && (
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
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasContent}
            size="sm"
            className="btn-primary-glow"
          >
            {isSaving ? (
              <Loader2
                className="size-4 mr-1.5 motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Save className="size-4 mr-1.5" aria-hidden="true" />
            )}
            Save
          </Button>
          {hasContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateAll}
              disabled={isGeneratingAll || !scriptText}
              className="text-muted-foreground hover:text-foreground"
            >
              {isGeneratingAll ? (
                <Loader2
                  className="size-4 mr-1.5 motion-safe:animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <RefreshCw className="size-4 mr-1.5" aria-hidden="true" />
              )}
              Regenerate All
            </Button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {/* Titles */}
        <div className="space-y-1">
          {currentPackaging?.itemStatuses?.title && (
            <ItemStaleIndicator status={currentPackaging.itemStatuses.title} />
          )}
          <TitlesCard
            titles={titles.titles}
            selectedIndex={titles.selectedIndex}
            isLoading={titles.isLoading}
            error={titles.error}
            onRegenerate={
              packagingId
                ? () => handleRegenerateItem("title")
                : () => dispatch(generateTitle())
            }
            onSelectTitle={(index) => dispatch(setSelectedTitle(index))}
            onEditTitle={(index, value) =>
              dispatch(updateTitleVariation({ index, value }))
            }
            feedback={packagingId ? (itemFeedback.title ?? null) : undefined}
            onFeedback={packagingId ? (fb) => handleFeedback("title", fb) : undefined}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          {currentPackaging?.itemStatuses?.description && (
            <ItemStaleIndicator
              status={currentPackaging.itemStatuses.description}
            />
          )}
          <OutputCard
            title="Description"
            icon={<FileText className="size-4" />}
            content={description.content}
            isLoading={description.isLoading}
            error={description.error}
            characterLimit={PACKAGING_LIMITS.description}
            onRegenerate={
              packagingId
                ? () => handleRegenerateItem("description")
                : () => dispatch(generateDescription())
            }
            onEdit={(content) => dispatch(updateDescription(content))}
            editable
            accentColor="blue"
            feedback={packagingId ? (itemFeedback.description ?? null) : undefined}
            onFeedback={packagingId ? (fb) => handleFeedback("description", fb) : undefined}
          />
        </div>

        {/* Thumbnails */}
        <div className="space-y-1">
          {currentPackaging?.itemStatuses?.thumbnail && (
            <ItemStaleIndicator
              status={currentPackaging.itemStatuses.thumbnail}
            />
          )}
          <ThumbnailsCard
            descriptions={thumbnails.descriptions}
            selectedIndex={thumbnails.selectedIndex}
            isLoading={thumbnails.isLoading}
            error={thumbnails.error}
            onRegenerate={
              packagingId
                ? () => handleRegenerateItem("thumbnail")
                : () => dispatch(generateThumbnail())
            }
            onSelectThumbnail={(index) => dispatch(setSelectedThumbnail(index))}
            feedback={packagingId ? (itemFeedback.thumbnail ?? null) : undefined}
            onFeedback={packagingId ? (fb) => handleFeedback("thumbnail", fb) : undefined}
          />
        </div>

        {/* Shorts Scripts */}
        <div className="space-y-1">
          {currentPackaging?.itemStatuses?.shorts && (
            <ItemStaleIndicator
              status={currentPackaging.itemStatuses.shorts}
            />
          )}
          <ShortsScriptCard
            scripts={shortsScript.scripts}
            isAddingNew={shortsScript.isAddingNew}
            canAddMore={canAddMoreShorts}
            onAddNew={() => dispatch(addNewShortsScript())}
            onRegenerate={(scriptId) =>
              dispatch(regenerateShortsScript(scriptId))
            }
            onDelete={(scriptId) => dispatch(deleteShortsScript(scriptId))}
            feedback={packagingId ? (itemFeedback.shorts ?? null) : undefined}
            onFeedback={packagingId ? (fb) => handleFeedback("shorts", fb) : undefined}
          />
        </div>
      </div>

    </div>
  );
};

export default ProjectPackagingPage;

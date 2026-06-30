import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Download,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TopicGrid, TrendingTab, CompetitorsTab, KeywordsTab } from "@/components/research";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectActiveTopics,
  selectHasLinkedProjects,
  selectTopicsCursor,
  selectTitlesLoading,
  selectTitlesIsRegenerating,
  selectTitlesIsExporting,
  selectTitlesExportText,
  selectTitlesError,
  clearExportText,
} from "@/utils/feature/titles/titles.slice";
import {
  selectTrending,
  selectCompetitors,
  selectKeywords,
} from "@/utils/feature/research/research.slice";
import {
  fetchTrending,
  fetchCompetitors,
  fetchKeywords,
} from "@/utils/feature/research/research.thunk";
import {
  retrieveTitles,
  generateTitles,
  regenerateAllTopics,
  regenerateOneTopic,
  submitTopicFeedback,
  exportTopics,
} from "@/utils/feature/titles/titles.thunk";
import { createProject } from "@/utils/feature/videoProject/videoProject.thunk";
import { selectIsCreating } from "@/utils/feature/videoProject/videoProject.slice";
import { toastError, toastSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

type ConfirmDialog =
  | { type: "regenerateAll" }
  | { type: "regenerateOne"; topicId: string }
  | null;

const ResearchPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const topics = useAppSelector(selectActiveTopics);
  const isLoading = useAppSelector(selectTitlesLoading);
  const isRegenerating = useAppSelector(selectTitlesIsRegenerating);
  const isExporting = useAppSelector(selectTitlesIsExporting);
  const exportText = useAppSelector(selectTitlesExportText);
  const error = useAppSelector(selectTitlesError);
  const hasLinkedProjects = useAppSelector(selectHasLinkedProjects);
  const cursor = useAppSelector(selectTopicsCursor);
  const isCreatingProject = useAppSelector(selectIsCreating);
  const trending = useAppSelector(selectTrending);
  const competitors = useAppSelector(selectCompetitors);
  const keywords = useAppSelector(selectKeywords);

  const [activeIntelTab, setActiveIntelTab] = useState<"trending" | "competitors" | "keywords">("trending");
  const [regeneratingTopicId, setRegeneratingTopicId] = useState<string | null>(
    null
  );
  const [creatingForTopicId, setCreatingForTopicId] = useState<string | null>(
    null
  );
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(null);

  const hasTopics = topics.length > 0;

  useEffect(() => {
    dispatch(retrieveTitles({ isFresh: true }));
  }, [dispatch]);

  // Copy export text to clipboard when it arrives, then clear
  useEffect(() => {
    if (exportText) {
      navigator.clipboard
        .writeText(exportText)
        .then(() => toastSuccess("Topics copied to clipboard"))
        .catch(() => toastError("Failed to copy to clipboard"))
        .finally(() => dispatch(clearExportText()));
    }
  }, [exportText, dispatch]);

  // Clear local regenerating state when global flag resets
  useEffect(() => {
    if (!isRegenerating && regeneratingTopicId) {
      setRegeneratingTopicId(null);
    }
  }, [isRegenerating, regeneratingTopicId]);

  // Clear local creating state when global flag resets
  useEffect(() => {
    if (!isCreatingProject && creatingForTopicId) {
      setCreatingForTopicId(null);
    }
  }, [isCreatingProject, creatingForTopicId]);

  // Fetch research data when a tab becomes active (only if not already loaded or errored)
  useEffect(() => {
    if (!hasTopics) return;
    if (activeIntelTab === "trending" && !trending.videos.length && !trending.isLoading && !trending.error) {
      dispatch(fetchTrending());
    } else if (activeIntelTab === "competitors" && !competitors.channels.length && !competitors.isLoading && !competitors.error) {
      dispatch(fetchCompetitors());
    }
    // Keywords are fetched on-demand via search, not on tab activation
  }, [activeIntelTab, hasTopics, trending, competitors, dispatch]);

  const handleGenerate = useCallback(() => {
    dispatch(generateTitles());
  }, [dispatch]);

  const handleExport = useCallback(() => {
    dispatch(exportTopics());
  }, [dispatch]);

  const handleRegenerate = useCallback(
    (topicId: string, hasProject: boolean) => {
      if (hasProject) {
        setConfirmDialog({ type: "regenerateOne", topicId });
      } else {
        setRegeneratingTopicId(topicId);
        dispatch(regenerateOneTopic(topicId));
      }
    },
    [dispatch]
  );

  const handleRegenerateOneConfirm = useCallback(() => {
    if (confirmDialog?.type !== "regenerateOne") return;
    setRegeneratingTopicId(confirmDialog.topicId);
    dispatch(regenerateOneTopic(confirmDialog.topicId));
    setConfirmDialog(null);
  }, [dispatch, confirmDialog]);

  const handleRegenerateAll = useCallback(async () => {
    if (hasLinkedProjects) {
      setConfirmDialog({ type: "regenerateAll" });
      return;
    }
    const result = await dispatch(regenerateAllTopics());
    if (regenerateAllTopics.fulfilled.match(result)) {
      dispatch(retrieveTitles({ isFresh: true }));
    }
  }, [dispatch, hasLinkedProjects]);

  const handleRegenerateAllConfirm = useCallback(async () => {
    setConfirmDialog(null);
    const result = await dispatch(regenerateAllTopics());
    if (regenerateAllTopics.fulfilled.match(result)) {
      dispatch(retrieveTitles({ isFresh: true }));
    }
  }, [dispatch]);

  const handleFeedback = useCallback(
    (topicId: string, feedback: "like" | "dislike" | null) => {
      dispatch(submitTopicFeedback({ topicId, feedback }));
    },
    [dispatch]
  );

  const handleUseThisTopic = useCallback(
    async (topicId: string, videoProjectId: string | null) => {
      if (videoProjectId) {
        navigate(`/app/project/${videoProjectId}`);
        return;
      }
      setCreatingForTopicId(topicId);
      const result = await dispatch(createProject({ topicId }));
      if (createProject.fulfilled.match(result) && result.payload) {
        navigate(`/app/project/${result.payload.id}`);
      } else if (createProject.rejected.match(result)) {
        toastError("Failed to create project");
      }
    },
    [dispatch, navigate]
  );

  const handleLoadMore = useCallback(() => {
    if (!cursor?.hasNextPage || !cursor.nextCursor || isLoading) return;
    dispatch(
      retrieveTitles({
        createdAt: cursor.nextCursor.createdAt,
        docId: cursor.nextCursor.docId,
      })
    );
  }, [dispatch, cursor, isLoading]);

  const showEmptyState = !isLoading && !isRegenerating && !error && !hasTopics;
  const showGrid = hasTopics || isLoading || isRegenerating;

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title="Research" />

      {/* Page actions */}
      {hasTopics && (
        <div className="flex items-center justify-end gap-3 mb-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-hover"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-hover"
            onClick={handleRegenerateAll}
            disabled={isRegenerating || regeneratingTopicId !== null}
          >
            {isRegenerating && !regeneratingTopicId ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Regenerate All
          </Button>
          <Button
            size="sm"
            className="btn-primary-glow"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading && !isRegenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Generate More
          </Button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-6 flex items-center justify-between gap-4"
        >
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(retrieveTitles({ isFresh: true }))}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {showEmptyState && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="icon-container mb-4">
            <Lightbulb className="size-6" />
          </div>
          <h2 className="text-title text-xl mb-2">No topics yet</h2>
          <p className="text-label max-w-md mb-6">
            Generate topic ideas for your next video. We&apos;ll analyze trends
            and suggest topics tailored to your niche.
          </p>
          <Button
            className="btn-primary-glow"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            <Sparkles className="size-4" /> Generate Topics
          </Button>
        </div>
      )}

      {/* Topic grid */}
      {showGrid && (
        <TopicGrid
          topics={topics}
          isLoading={isLoading || isRegenerating}
          regeneratingTopicId={regeneratingTopicId}
          creatingForTopicId={creatingForTopicId}
          onUseThisTopic={handleUseThisTopic}
          onRegenerate={handleRegenerate}
          onFeedback={handleFeedback}
        />
      )}

      {/* Load more */}
      {cursor?.hasNextPage && hasTopics && !isRegenerating && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            className="btn-outline-hover"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Research Intel Panel */}
      {hasTopics && (
        <section className="mt-12">
          <h2 className="text-heading-lg mb-4">Research Intel</h2>
          <div className="flex gap-2 mb-4" role="tablist" aria-label="Research intelligence tabs">
            {(["trending", "competitors", "keywords"] as const).map((tab) => (
              <Button
                key={tab}
                id={tab}
                variant="outline"
                size="sm"
                role="tab"
                aria-selected={activeIntelTab === tab}
                aria-controls={`panel-${tab}`}
                onClick={() => setActiveIntelTab(tab)}
                className={cn(
                  "btn-outline-hover capitalize",
                  activeIntelTab === tab && "bg-white/10 border-white/20"
                )}
              >
                {tab}
              </Button>
            ))}
          </div>
          <div id={`panel-${activeIntelTab}`} role="tabpanel" aria-labelledby={activeIntelTab}>
            {activeIntelTab === "trending" && (
              <TrendingTab
                videos={trending.videos}
                isLoading={trending.isLoading}
                error={trending.error}
              />
            )}
            {activeIntelTab === "competitors" && (
              <CompetitorsTab
                channels={competitors.channels}
                isLoading={competitors.isLoading}
                error={competitors.error}
              />
            )}
            {activeIntelTab === "keywords" && (
              <KeywordsTab
                results={keywords.results}
                isLoading={keywords.isLoading}
                error={keywords.error}
                onSearch={(query) => dispatch(fetchKeywords(query))}
              />
            )}
          </div>
        </section>
      )}

      {/* Regenerate One confirmation dialog */}
      <Dialog
        open={confirmDialog?.type === "regenerateOne"}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-400" />
              Disconnect from project?
            </DialogTitle>
            <DialogDescription>
              This topic is linked to an active video project. Regenerating it
              will create a new topic and disconnect it from the existing
              project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenerateOneConfirm}>
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate All confirmation dialog */}
      <Dialog
        open={confirmDialog?.type === "regenerateAll"}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-400" />
              Regenerate all topics?
            </DialogTitle>
            <DialogDescription>
              This will archive all current topics and generate a fresh batch.
              Topics linked to active video projects will be disconnected, which
              may mark those projects as stale.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenerateAllConfirm}
            >
              Regenerate All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchPage;

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Video } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  listProjects,
  deleteProject,
} from "@/utils/feature/videoProject/videoProject.thunk";
import {
  selectProjects,
  selectProjectsLoading,
  selectHasMoreProjects,
  selectNextCursor,
  selectIsDeleting,
  selectError,
} from "@/utils/feature/videoProject/videoProject.slice";
import type { OverallStatus } from "@/types/feature/videoProject";
import { Button } from "@/components/ui/button";
import { StatusFilterTabs } from "./StatusFilterTabs";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

export const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectProjectsLoading);
  const hasMore = useAppSelector(selectHasMoreProjects);
  const nextCursor = useAppSelector(selectNextCursor);
  const isDeleting = useAppSelector(selectIsDeleting);
  const error = useAppSelector(selectError);

  const [statusFilter, setStatusFilter] = useState<OverallStatus | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const prevFilter = useRef(statusFilter);

  useEffect(() => {
    const filterChanged = prevFilter.current !== statusFilter;
    prevFilter.current = statusFilter;
    if (filterChanged) {
      setIsFilterChanging(true);
    }
    // Skip refetch on re-mount if data is already loaded for default filter
    if (!filterChanged && projects.length > 0 && statusFilter === "all") {
      return;
    }
    const params = statusFilter === "all" ? undefined : { status: statusFilter };
    dispatch(listProjects(params));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (!isLoading && isFilterChanging) {
      setIsFilterChanging(false);
    }
  }, [isLoading, isFilterChanging]);

  const handleLoadMore = useCallback(() => {
    if (!nextCursor || isLoading) return;
    const params = statusFilter === "all"
      ? { cursor: nextCursor }
      : { status: statusFilter, cursor: nextCursor };
    dispatch(listProjects(params));
  }, [dispatch, nextCursor, isLoading, statusFilter]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteProject(deleteTarget.id));
    if (deleteProject.fulfilled.match(result)) {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  const showSkeleton = isFilterChanging || (projects.length === 0 && isLoading);
  const isLoadingMore = !isFilterChanging && projects.length > 0 && isLoading;

  return (
    <section aria-label="Your video projects">
      <div className="flex-between flex-wrap gap-4 mb-6">
        <h2 className="text-heading-lg">Your Videos</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusFilterTabs activeFilter={statusFilter} onChange={setStatusFilter} />
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-hover"
            onClick={() => navigate("/app/research")}
          >
            <Plus className="size-4" /> New Video
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-6 flex-between gap-4">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const params = statusFilter === "all" ? undefined : { status: statusFilter };
              dispatch(listProjects(params));
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {showSkeleton && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      )}

      {!isLoading && !isFilterChanging && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-container mb-4">
            <Video className="size-6" />
          </div>
          <h3 className="text-title text-lg mb-2">No projects yet</h3>
          <p className="text-label mb-6 max-w-sm">
            Start by researching a topic and creating your first video project.
          </p>
          <Button
            className="btn-primary-glow"
            onClick={() => navigate("/app/research")}
          >
            Start Your First Video
          </Button>
        </div>
      )}

      {!isFilterChanging && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={(id, title) => setDeleteTarget({ id, title })}
            />
          ))}
        </div>
      )}

      {hasMore && !showSkeleton && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            className="btn-outline-hover"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
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

      <DeleteProjectDialog
        open={deleteTarget !== null}
        projectTitle={deleteTarget?.title ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
};

import React, { useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getProject } from "@/utils/feature/videoProject/videoProject.thunk";
import {
  selectCurrentProject,
  selectProjectLoading,
  selectProjectError,
  selectIsDeleting,
  clearCurrentProject,
} from "@/utils/feature/videoProject/videoProject.slice";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "./ProjectHeader";
import { PipelineTracker } from "./PipelineTracker";

function getUserFriendlyError(error: string): string {
  if (error.includes("404")) return "Project not found. It may have been deleted.";
  if (error.includes("Network Error")) return "Unable to connect. Please check your internet connection.";
  return "Something went wrong. Please try again.";
}

export const ProjectPipelineLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const project = useAppSelector(selectCurrentProject);
  const isLoading = useAppSelector(selectProjectLoading);
  const error = useAppSelector(selectProjectError);
  const isDeleting = useAppSelector(selectIsDeleting);

  const loadedProjectId = project?.id ?? null;
  const wasDeletingRef = useRef(false);
  const fetchedForIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    if (fetchedForIdRef.current === projectId) return;
    if (loadedProjectId === projectId) {
      fetchedForIdRef.current = projectId;
      return;
    }
    fetchedForIdRef.current = projectId;
    dispatch(clearCurrentProject());
    dispatch(getProject(projectId));
  }, [dispatch, projectId, loadedProjectId]);

  // Redirect to dashboard after deletion
  useEffect(() => {
    if (isDeleting) {
      wasDeletingRef.current = true;
    }
    if (wasDeletingRef.current && !isDeleting && !project) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [isDeleting, project, navigate]);

  if (!projectId) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (isLoading && (!project || loadedProjectId !== projectId)) {
    return (
      <div
        role="status"
        aria-label="Loading project"
        className="flex items-center justify-center py-32"
      >
        <Loader2 className="h-8 w-8 motion-safe:animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-destructive">{getUserFriendlyError(error)}</p>
        <Button variant="outline" onClick={() => navigate("/app/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="w-full md:max-w-7xl mx-auto pb-20">
      <ProjectHeader />
      <PipelineTracker />
      <div className="mt-6 md:mt-8">
        <Outlet />
      </div>
      {isDeleting && (
        <div
          role="alert"
          aria-label="Deleting project"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Loader2 className="h-8 w-8 motion-safe:animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

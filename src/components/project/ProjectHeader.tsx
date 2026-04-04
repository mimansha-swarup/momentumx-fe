import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectCurrentProject,
  selectIsUpdating,
} from "@/utils/feature/videoProject/videoProject.slice";
import { updateWorkingTitle } from "@/utils/feature/videoProject/videoProject.thunk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toastError } from "@/utils/toast";
import type { OverallStatus } from "@/types/feature/videoProject";

function getStatusBadgeProps(status: OverallStatus) {
  switch (status) {
    case "in_progress":
      return {
        variant: "secondary" as const,
        className: "text-blue-400",
        label: "In Progress",
      };
    case "completed":
      return {
        variant: "secondary" as const,
        className: "text-emerald-400",
        label: "Completed",
      };
    case "stale":
      return {
        variant: "outline" as const,
        className: "border-amber-500/50 text-amber-400 bg-amber-500/10",
        label: "Needs Update",
      };
  }
}

export const ProjectHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectCurrentProject);
  const isUpdating = useAppSelector(selectIsUpdating);
  const { toggleSidebar } = useSidebar();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!project) return null;

  const currentProject = project;
  const statusBadge = getStatusBadgeProps(currentProject.overallStatus);

  function handleTitleClick() {
    setEditValue(currentProject.workingTitle);
    setIsEditing(true);
  }

  async function handleTitleSave() {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === currentProject.workingTitle) {
      setIsEditing(false);
      return;
    }
    try {
      await dispatch(
        updateWorkingTitle({ projectId: currentProject.id, workingTitle: trimmed })
      ).unwrap();
      setIsEditing(false);
    } catch {
      setEditValue(currentProject.workingTitle);
      toastError("Failed to update title");
      setIsEditing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      void handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  return (
    <header
      className={cn(
        "flex items-center gap-3",
        "pl-4 md:pl-0 pb-6 md:pb-8"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Back to dashboard"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/app/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isEditing ? (
          <>
            <h1 className="sr-only">{editValue || currentProject.workingTitle}</h1>
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditValue(e.target.value)
              }
              onBlur={() => void handleTitleSave()}
              onKeyDown={handleKeyDown}
              disabled={isUpdating}
              maxLength={200}
              aria-label="Edit working title"
              className={cn(
                "bg-transparent text-foreground font-semibold text-lg leading-tight",
                "border-b border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "w-full min-w-0 py-0.5",
                "disabled:opacity-60"
              )}
            />
          </>
        ) : (
          <>
            <h1 className="text-foreground font-semibold text-lg leading-tight truncate min-w-0">
              {project.workingTitle}
            </h1>
            <button
              type="button"
              aria-label={`Edit working title: ${project.workingTitle}`}
              onClick={handleTitleClick}
              className={cn(
                "shrink-0 text-muted-foreground opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-0.5"
              )}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        )}

        <Badge variant={statusBadge.variant} className={cn("shrink-0", statusBadge.className)}>
          {statusBadge.label}
        </Badge>
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle menu"
        className="ml-auto block md:hidden shrink-0 text-muted-foreground hover:text-foreground"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </header>
  );
};

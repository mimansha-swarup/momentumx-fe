import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import GlassCard from "@/components/shared/glassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date";
import type {
  IVideoProjectListItem,
  OverallStatus,
  StepName,
} from "@/types/feature/videoProject";

interface ProjectCardProps {
  project: IVideoProjectListItem;
  onDelete: (id: string, title: string) => void;
}

function getStatusBadgeProps(status: OverallStatus) {
  switch (status) {
    case "in_progress":
      return { variant: "secondary" as const, className: "text-blue-400", label: "In Progress" };
    case "completed":
      return { variant: "secondary" as const, className: "text-emerald-400", label: "Completed" };
    case "stale":
      return {
        variant: "outline" as const,
        className: "border-amber-500/50 text-amber-400 bg-amber-500/10",
        label: "Needs Update",
      };
  }
}

function getStepLabel(step: StepName): string {
  const labels: Record<StepName, string> = {
    research: "Research",
    script: "Script",
    hooks: "Hooks",
    packaging: "Packaging",
  };
  return labels[step];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const statusBadge = getStatusBadgeProps(project.overallStatus);
  const relativeTime = formatRelativeTime(project.lastUpdatedAt);

  return (
    <GlassCard className="hover-scale-sm p-5">
      <div className="flex flex-col gap-3">
        <div className="flex-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-title text-base line-clamp-1">
              {project.workingTitle}
            </h3>
            {project.thumbnailHint && (
              <p className="text-caption line-clamp-1 mt-0.5">
                {project.thumbnailHint}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={`Delete project ${project.workingTitle}`}
            className={cn(
              "shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors duration-200",
              "hover:text-destructive hover:bg-destructive/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
            )}
            onClick={() => onDelete(project.id, project.workingTitle)}
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusBadge.variant} className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
          <Badge variant="outline">{getStepLabel(project.currentStep)}</Badge>
        </div>

        <div className="flex-between gap-3 mt-1">
          {relativeTime && (
            <span className="text-caption">{relativeTime}</span>
          )}
          <Button
            size="sm"
            className="ml-auto btn-primary-glow"
            onClick={() => navigate(`/app/project/${project.id}`)}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

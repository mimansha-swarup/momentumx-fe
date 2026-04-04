import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Anchor, Package, Check, AlertTriangle, type LucideIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentProject } from "@/utils/feature/videoProject/videoProject.slice";
import { StepName, StepStatus } from "@/types/feature/videoProject";
import { cn } from "@/lib/utils";

const PIPELINE_STEPS: { name: StepName; label: string; icon: LucideIcon }[] = [
  { name: "research", label: "Research", icon: Search },
  { name: "script", label: "Script", icon: FileText },
  { name: "hooks", label: "Hooks", icon: Anchor },
  { name: "packaging", label: "Packaging", icon: Package },
];

interface StepStyleConfig {
  container: string;
  icon: string;
  line: string;
}

function getStepStyles(status: StepStatus): StepStyleConfig {
  switch (status) {
    case "completed":
      return {
        container: "bg-emerald-500/20 text-emerald-400",
        icon: "text-emerald-400",
        line: "bg-emerald-500/50",
      };
    case "in_progress":
      return {
        container: "bg-primary/20 text-primary ring-2 ring-primary/50",
        icon: "text-primary",
        line: "bg-border",
      };
    case "stale":
      return {
        container: "bg-amber-500/20 text-amber-400",
        icon: "text-amber-400",
        line: "bg-amber-500/50",
      };
    case "not_started":
    default:
      return {
        container: "bg-secondary text-muted-foreground",
        icon: "text-muted-foreground",
        line: "bg-border",
      };
  }
}

function getOverlayIcon(status: StepStatus): LucideIcon | null {
  if (status === "completed") return Check;
  if (status === "stale") return AlertTriangle;
  return null;
}

export const PipelineTracker: React.FC = () => {
  const navigate = useNavigate();
  const project = useAppSelector(selectCurrentProject);

  const handleStepClick = (stepName: StepName, status: StepStatus) => {
    if (stepName === "research") return;
    if (status === "not_started") return;
    if (!project?.id) return;
    navigate(`/app/project/${project.id}/${stepName}`);
  };

  return (
    <nav
      aria-label="Pipeline progress"
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6"
    >
      <ol className="flex items-center justify-between">
        {PIPELINE_STEPS.map((step, index) => {
          const status: StepStatus =
            project?.pipeline[step.name]?.status ?? "not_started";
          const styles = getStepStyles(status);
          const OverlayIcon = getOverlayIcon(status);
          const StepIcon = step.icon;

          const isClickable = step.name !== "research" && status !== "not_started";

          const prevStatus: StepStatus =
            index > 0
              ? (project?.pipeline[PIPELINE_STEPS[index - 1].name]?.status ?? "not_started")
              : "not_started";
          const lineStyles = getStepStyles(prevStatus);

          return (
            <React.Fragment key={step.name}>
              {index > 0 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2 transition-all duration-300",
                    lineStyles.line
                  )}
                  aria-hidden="true"
                />
              )}

              <li className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.name, status)}
                  disabled={!isClickable}
                  aria-current={
                    status === "in_progress" ? "step" : undefined
                  }
                  aria-label={`${step.label}: ${status.replace(/_/g, " ")}`}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    styles.container,
                    isClickable
                      ? "cursor-pointer hover:opacity-80 active:scale-95"
                      : "cursor-default"
                  )}
                >
                  {status === "in_progress" && (
                    <span className="absolute inset-0 rounded-full motion-safe:animate-pulse bg-primary/20" aria-hidden="true" />
                  )}
                  {OverlayIcon ? (
                    <OverlayIcon className={cn("w-4 h-4 md:w-5 md:h-5 relative z-10", styles.icon)} />
                  ) : (
                    <StepIcon className={cn("w-4 h-4 md:w-5 md:h-5 relative z-10", styles.icon)} />
                  )}
                </button>

                <span
                  aria-hidden="true"
                  className={cn(
                    "text-xs md:text-sm font-medium transition-all duration-300",
                    status === "not_started"
                      ? "text-muted-foreground"
                      : status === "completed"
                      ? "text-emerald-400"
                      : status === "stale"
                      ? "text-amber-400"
                      : "text-primary"
                  )}
                >
                  {step.label}
                </span>
              </li>

            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

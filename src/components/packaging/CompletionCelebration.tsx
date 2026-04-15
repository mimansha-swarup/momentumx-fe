import React from "react";
import { CheckCircle2, Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompletionCelebrationProps {
  projectTitle: string;
  onExport: () => void;
  onBackToProjects: () => void;
  isExporting?: boolean;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  projectTitle,
  onExport,
  onBackToProjects,
  isExporting = false,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-emerald-500/30 p-6",
        "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
        "backdrop-blur-sm",
        "transition-all duration-300"
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {/* Icon */}
        <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/25">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            Your Video Project is Complete!
          </h3>
          <p className="text-sm text-muted-foreground">{projectTitle}</p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToProjects}
            className="text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Back to Projects
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
            className={cn(
              "border-emerald-500/40 text-emerald-300",
              "hover:bg-emerald-500/10 hover:text-emerald-200",
              "transition-all duration-200"
            )}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Export Packaging
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

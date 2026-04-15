import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import GradientSkeleton from "./GradientSkeleton";

interface ScriptPreviewProps {
  script: string;
  isLoading?: boolean;
}

export const ScriptPreview: React.FC<ScriptPreviewProps> = ({
  script,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10",
        "bg-white/5 backdrop-blur-sm",
        "transition-all duration-200"
      )}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">Script</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((prev) => !prev)}
          disabled={isLoading}
          aria-expanded={isExpanded}
          className="text-muted-foreground hover:text-foreground hover:bg-white/5"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" aria-hidden="true" />
              Hide Script
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" aria-hidden="true" />
              View Script
            </>
          )}
        </Button>
      </div>

      {/* Collapsible body */}
      {isExpanded && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">
          {isLoading ? (
            <GradientSkeleton lines={5} />
          ) : (
            <div
              className="max-h-60 overflow-y-auto scroll-smooth text-foreground/80"
              aria-label="Script content"
            >
              <MarkdownPreview content={script} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

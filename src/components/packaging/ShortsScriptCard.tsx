import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Film,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import GradientSkeleton from "./GradientSkeleton";
import {
  IShortsScript,
  MAX_SHORTS_SCRIPTS,
} from "@/types/feature/packaging";
import { FeedbackButtons } from "@/components/research/FeedbackButtons";

interface ShortsScriptCardProps {
  scripts: IShortsScript[];
  isAddingNew: boolean;
  canAddMore: boolean;
  onAddNew: () => void;
  onRegenerate: (scriptId: string) => void;
  onDelete: (scriptId: string) => void;
  feedback?: "like" | "dislike" | null;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
}

const segmentStyles = {
  hook: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    badge: "bg-primary/20 text-primary",
  },
  point: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  transition: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
  },
  cta: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
};

interface SingleScriptProps {
  script: IShortsScript;
  index: number;
  totalScripts: number;
  onRegenerate: () => void;
  onDelete: () => void;
}

const SingleScript = ({
  script,
  index,
  totalScripts,
  onRegenerate,
  onDelete,
}: SingleScriptProps) => {

  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyAll = async () => {
    try {
      const fullScript = script.segments
        .map((seg) => `[${seg.startTime} - ${seg.endTime}]\n${seg.content}`)
        .join("\n\n");
      await navigator.clipboard.writeText(fullScript);
      setCopied(true);
      toastSuccess("Script copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Failed to copy");
    }
  };

  const getTotalDuration = () => {
    if (script.segments.length === 0) return "0:00";
    const lastSegment = script.segments[script.segments.length - 1];
    return lastSegment.endTime;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/5",
        "transition-all duration-300",
        "hover:border-white/20",
      )}
    >
      {/* Script Header */}
      <button
        type="button"
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30">
            <span className="text-sm font-bold text-pink-400">{index + 1}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Script Variation {index + 1}
            </h4>
            {!script.isLoading && script.segments.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{getTotalDuration()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!script.isLoading && script.segments.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy script"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAll();
                }}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Regenerate script"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerate();
                }}
                disabled={script.isLoading}
              >
                <RefreshCw className={cn("h-3.5 w-3.5", script.isLoading && "motion-safe:animate-spin")} />
              </Button>
            </>
          )}
          {totalScripts > 1 && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete script variation"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={isExpanded ? "Collapse script" : "Expand script"}
            className="h-7 w-7 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </button>

      {/* Script Content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4">
          {script.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 shrink-0">
                    <GradientSkeleton lines={1} className="h-4" />
                  </div>
                  <div className="flex-1">
                    <GradientSkeleton lines={2} />
                  </div>
                </div>
              ))}
            </div>
          ) : script.error ? (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
              {script.error}
            </div>
          ) : script.segments.length > 0 ? (
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-[44px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-pink-500/50 to-emerald-500/50" />

              {script.segments.map((segment, segIndex) => {
                const style = segmentStyles[segment.type];
                return (
                  <div
                    key={segIndex}
                    className="group relative flex items-start gap-3 py-2.5"
                  >
                    {/* Timestamp */}
                    <div className="w-10 shrink-0 pt-0.5 text-right">
                      <span className="text-[10px] font-mono font-medium text-muted-foreground">
                        {segment.startTime}
                      </span>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          "ring-2 ring-background",
                          style.bg,
                          "border",
                          style.border,
                          "transition-transform group-hover:scale-125",
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={cn(
                        "flex-1 rounded-lg p-2.5",
                        style.bg,
                        "border",
                        style.border,
                        "transition-all group-hover:translate-x-0.5",
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          className={cn(
                            "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                            style.badge,
                          )}
                        >
                          {segment.type}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {segment.startTime} - {segment.endTime}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        {segment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Film className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Click regenerate to generate this script
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ShortsScriptCard = ({
  scripts,
  isAddingNew,
  canAddMore,
  onAddNew,
  onRegenerate,
  onDelete,
  feedback,
  onFeedback,
}: ShortsScriptCardProps) => {

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-white/20",
      )}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-primary/5" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-primary/20 border border-pink-500/30">
              <Film className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">
                YT Shorts Scripts
              </h3>
              <p className="text-xs text-muted-foreground">
                {scripts.length} of {MAX_SHORTS_SCRIPTS} variations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onFeedback && (
              <FeedbackButtons
                topicId="shorts"
                feedback={feedback ?? null}
                onFeedback={(_id, fb) => onFeedback(fb)}
              />
            )}
            {canAddMore && (
              <Button
                variant="outline"
                size="sm"
                className="border-dashed border-white/20 text-muted-foreground hover:text-foreground hover:border-white/30 hover:bg-white/5"
                onClick={onAddNew}
                disabled={isAddingNew}
              >
                {isAddingNew ? (
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 motion-safe:animate-spin" />
                ) : (
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                )}
                Add Variation
              </Button>
            )}
          </div>
        </div>

        {/* Scripts List */}
        {scripts.length > 0 ? (
          <div className="space-y-4">
            {scripts.map((script, index) => (
              <SingleScript
                key={script.id}
                script={script}
                index={index}
                totalScripts={scripts.length}
                onRegenerate={() => onRegenerate(script.id)}
                onDelete={() => onDelete(script.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">No shorts scripts yet</p>
            <p className="text-xs text-muted-foreground">
              Generate your first script using the button above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsScriptCard;

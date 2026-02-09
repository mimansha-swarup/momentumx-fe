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
import { toast } from "sonner";
import GradientSkeleton from "./GradientSkeleton";
import {
  IShortsScript,
  ITimestampedSegment,
  MAX_SHORTS_SCRIPTS,
} from "@/types/feature/packaging";

interface ShortsScriptCardProps {
  scripts: IShortsScript[];
  isAddingNew: boolean;
  canAddMore: boolean;
  onAddNew: () => void;
  onRegenerate: (scriptId: string) => void;
  onDelete: (scriptId: string) => void;
}

const segmentStyles = {
  hook: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
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

  console.log("21345678", script)
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyAll = async () => {
    try {
      const fullScript = script.segments
        .map((seg) => `[${seg.startTime} - ${seg.endTime}]\n${seg.content}`)
        .join("\n\n");
      await navigator.clipboard.writeText(fullScript);
      setCopied(true);
      toast.success("Script copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
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
        "rounded-xl border border-slate-700/50 bg-slate-800/30",
        "transition-all duration-300",
        "hover:border-slate-600/50",
      )}
    >
      {/* Script Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30">
            <span className="text-sm font-bold text-pink-400">{index + 1}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-200">
              Script Variation {index + 1}
            </h4>
            {!script.isLoading && script.segments.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
                className="h-7 w-7 text-slate-500 hover:text-slate-200"
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
                className={cn(
                  "h-7 w-7 text-slate-500 hover:text-slate-200",
                  script.isLoading && "animate-spin",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerate();
                }}
                disabled={script.isLoading}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {totalScripts > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-red-400"
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
            className="h-7 w-7 text-slate-500"
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
      </div>

      {/* Script Content */}
      {isExpanded && (
        <div className="border-t border-slate-700/50 p-4">
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
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {script.error}
            </div>
          ) : script.segments.length > 0 ? (
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-[44px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-pink-500/50 to-emerald-500/50" />

              {script.segments.map((segment, segIndex) => {
                const style = segmentStyles[segment.type];
                return (
                  <div
                    key={segIndex}
                    className="group relative flex items-start gap-3 py-2.5"
                  >
                    {/* Timestamp */}
                    <div className="w-10 shrink-0 pt-0.5 text-right">
                      <span className="text-[10px] font-mono font-medium text-slate-400">
                        {segment.startTime}
                      </span>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          "ring-2 ring-slate-900",
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
                        <span className="text-[9px] text-slate-500">
                          {segment.startTime} - {segment.endTime}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {segment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Film className="mb-2 h-6 w-6 text-slate-600" />
              <p className="text-xs text-slate-500">
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
}: ShortsScriptCardProps) => {

  console.log("scriptsss", 2314324234, scripts)
  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-slate-600/50",
      )}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-violet-500/5" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30">
              <Film className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-slate-100">
                YT Shorts Scripts
              </h3>
              <p className="text-xs text-slate-500">
                {scripts.length} of {MAX_SHORTS_SCRIPTS} variations
              </p>
            </div>
          </div>

          {canAddMore && (
            <Button
              variant="outline"
              size="sm"
              className="border-dashed border-slate-600 text-slate-400 hover:text-slate-100 hover:border-slate-500 hover:bg-slate-800/50"
              onClick={onAddNew}
              disabled={isAddingNew}
            >
              {isAddingNew ? (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="mr-1.5 h-3.5 w-3.5" />
              )}
              Add Variation
            </Button>
          )}
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <Film className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-400 mb-1">No shorts scripts yet</p>
            <p className="text-xs text-slate-500">
              Generate your first script using the button above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsScriptCard;

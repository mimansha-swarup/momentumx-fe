import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check, Pencil, X } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import GradientSkeleton from "./GradientSkeleton";
import { FeedbackButtons } from "@/components/research/FeedbackButtons";

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  isLoading: boolean;
  error?: string | null;
  characterLimit?: number;
  onRegenerate: () => void;
  onEdit?: (newContent: string) => void;
  editable?: boolean;
  skeletonLines?: number;
  className?: string;
  accentColor?: "violet" | "blue" | "emerald" | "amber";
  feedback?: "like" | "dislike" | null;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
}

const accentStyles = {
  violet: {
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
    text: "text-violet-400",
    bg: "bg-violet-500",
  },
  blue: {
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
    bg: "bg-blue-500",
  },
  emerald: {
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500",
  },
  amber: {
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500",
  },
};

const OutputCard = ({
  title,
  icon,
  content,
  isLoading,
  error,
  characterLimit,
  onRegenerate,
  onEdit,
  editable = true,
  skeletonLines = 3,
  className,
  accentColor = "violet",
  feedback,
  onFeedback,
}: OutputCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accent = accentStyles[accentColor];
  const charCount = content?.length;
  const isOverLimit = characterLimit ? charCount > characterLimit : false;
  const isNearLimit = characterLimit ? charCount > characterLimit * 0.9 : false;

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toastSuccess("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Failed to copy");
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && editValue !== content) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    } else if (e.key === "Enter" && e.metaKey) {
      handleSaveEdit();
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white/5",
        "border border-white/10",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-white/20",
        className
      )}
    >
      {/* Accent gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          "bg-gradient-to-br",
          accent.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                "bg-gradient-to-br",
                accent.gradient,
                "border",
                accent.border
              )}
            >
              <span className={accent.text}>{icon}</span>
            </div>
            <h3 className="font-semibold tracking-tight text-foreground">
              {title}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {!isLoading && content && !isEditing && (
              <>
                {editable && onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit content"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy to clipboard"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
            {onFeedback && (
              <FeedbackButtons
                topicId="output"
                feedback={feedback ?? null}
                onFeedback={(_id, fb) => onFeedback(fb)}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Regenerate"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "motion-safe:animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[80px]">
          {isLoading ? (
            <GradientSkeleton lines={skeletonLines} />
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive">
              <span className="text-sm">{error}</span>
            </div>
          ) : isEditing ? (
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full resize-none rounded-lg border bg-white/5 p-3",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2",
                  isOverLimit
                    ? "border-destructive/50 focus:ring-destructive/30"
                    : "border-white/10 focus:ring-primary/30"
                )}
                placeholder="Enter content..."
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Press <kbd className="rounded bg-secondary px-1">Esc</kbd> to
                  cancel, <kbd className="rounded bg-secondary px-1">Cmd+Enter</kbd>{" "}
                  to save
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-7 text-muted-foreground hover:text-foreground"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-7 bg-primary hover:bg-primary/90"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : content ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
              {content}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Click regenerate to generate content
            </p>
          )}
        </div>

        {/* Footer */}
        {characterLimit && !isLoading && content && !isEditing && (
          <div className="mt-4 flex items-center justify-end">
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                isOverLimit
                  ? "text-destructive"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-muted-foreground"
              )}
            >
              {charCount.toLocaleString()}/{characterLimit.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputCard;

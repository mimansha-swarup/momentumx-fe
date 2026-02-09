import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import GradientSkeleton from "./GradientSkeleton";

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
}: OutputCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accent = accentStyles[accentColor];
  const charCount = content.length;
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
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
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
        "bg-gradient-to-br from-slate-900/90 to-slate-950/90",
        "border border-slate-700/50",
        "backdrop-blur-xl",
        "transition-all duration-300",
        "hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/50",
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
            <h3 className="font-semibold tracking-tight text-slate-100">
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
                    className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
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
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
                isLoading && "animate-spin"
              )}
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[80px]">
          {isLoading ? (
            <GradientSkeleton lines={skeletonLines} />
          ) : error ? (
            <div className="flex items-center gap-2 text-red-400">
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
                  "w-full resize-none rounded-lg border bg-slate-800/50 p-3",
                  "text-sm text-slate-200 placeholder:text-slate-500",
                  "focus:outline-none focus:ring-2",
                  isOverLimit
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-slate-600/50 focus:ring-violet-500/30"
                )}
                placeholder="Enter content..."
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Press <kbd className="rounded bg-slate-700 px-1">Esc</kbd> to
                  cancel, <kbd className="rounded bg-slate-700 px-1">Cmd+Enter</kbd>{" "}
                  to save
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-7 text-slate-400 hover:text-slate-100"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-7 bg-violet-600 hover:bg-violet-500"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : content ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {content}
            </p>
          ) : (
            <p className="text-sm italic text-slate-500">
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
                  ? "text-red-400"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-slate-500"
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

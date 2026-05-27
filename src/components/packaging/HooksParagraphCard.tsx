import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Pencil,
  X,
  Zap,
  Trash2,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import GradientSkeleton from "./GradientSkeleton";
import { PACKAGING_LIMITS } from "@/types/feature/packaging";

interface HooksParagraphCardProps {
  hooks: string[];
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  onEditHook: (index: number, value: string) => void;
  onDeleteHook?: (index: number) => void;
}

interface HookItemProps {
  hook: string;
  index: number;
  isLoading: boolean;
  onEdit: (value: string) => void;
  onDelete?: () => void;
  canDelete: boolean;
}

const HookItem = ({
  hook,
  index,
  isLoading,
  onEdit,
  onDelete,
  canDelete,
}: HookItemProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(hook);

  const charCount = hook?.length || 0;
  const isOverLimit = charCount > PACKAGING_LIMITS.hook;
  const isNearLimit = charCount > PACKAGING_LIMITS.hook * 0.9;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook);
      setCopied(true);
      toastSuccess("Hook copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Failed to copy");
    }
  };

  const handleSave = () => {
    if (editValue !== hook) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditValue(hook);
    setIsEditing(true);
  };

  // Color variations based on index
  const colors = [
    { accent: "text-amber-400", border: "border-amber-500/20 hover:border-amber-500/40", bg: "bg-amber-500/10" },
    { accent: "text-rose-400", border: "border-rose-500/20 hover:border-rose-500/40", bg: "bg-rose-500/10" },
    { accent: "text-cyan-400", border: "border-cyan-500/20 hover:border-cyan-500/40", bg: "bg-cyan-500/10" },
    { accent: "text-primary", border: "border-primary/20 hover:border-primary/40", bg: "bg-primary/10" },
    { accent: "text-emerald-400", border: "border-emerald-500/20 hover:border-emerald-500/40", bg: "bg-emerald-500/10" },
  ];
  const color = colors[index % colors.length];

  return (
    <div
      className={cn(
        "group relative rounded-xl p-4",
        "bg-white/5 border",
        color.border,
        "transition-all duration-300"
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-lg", color.bg)}>
            <Zap className={cn("h-3 w-3", color.accent)} />
          </div>
          <span className={cn("text-xs font-medium uppercase tracking-wider", color.accent)}>
            Hook {index + 1}
          </span>
        </div>
        {!isLoading && hook && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit hook"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleStartEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy hook"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete hook"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <GradientSkeleton lines={2} />
      ) : isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn(
              "w-full resize-none rounded-lg border bg-white/5 p-3",
              "text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
              isOverLimit ? "border-destructive/50" : "border-white/10"
            )}
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsEditing(false);
              if (e.key === "Enter" && e.metaKey) handleSave();
            }}
          />
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {editValue.length}/{PACKAGING_LIMITS.hook}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-6 bg-primary text-xs hover:bg-primary/90"
                onClick={handleSave}
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : hook ? (
        <>
          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {hook}
          </p>
          <div className="mt-2 flex justify-end">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit
                  ? "text-destructive"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-muted-foreground"
              )}
            >
              {charCount}/{PACKAGING_LIMITS.hook}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm italic text-muted-foreground">Not generated yet</p>
      )}
    </div>
  );
};

const HooksParagraphCard = ({
  hooks,
  isLoading,
  error,
  onRegenerate,
  onEditHook,
  onDeleteHook,
}: HooksParagraphCardProps) => {
  // Show placeholders when loading and no hooks yet
  const displayHooks: string[] = hooks.length > 0 ? hooks : ["", "", ""];

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-white/20"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Hooks
              </h3>
              <p className="text-xs text-muted-foreground">
                Attention-grabbing opening statements
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Regenerate all hooks"
            className={cn(
              "text-muted-foreground hover:text-foreground hover:bg-white/5",
              isLoading && "[&_svg]:motion-safe:animate-spin"
            )}
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate All
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Hooks list */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayHooks.map((hook, index) => (
            <HookItem
              key={index}
              hook={hook}
              index={index}
              isLoading={isLoading && hooks.length === 0}
              onEdit={(value) => onEditHook(index, value)}
              onDelete={onDeleteHook ? () => onDeleteHook(index) : undefined}
              canDelete={hooks.length > 1}
            />
          ))}
        </div>

        {/* Empty state */}
        {!isLoading && hooks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Click regenerate to generate hooks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HooksParagraphCard;

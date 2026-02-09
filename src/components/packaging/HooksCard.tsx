import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Zap,
  MessageCircle,
  Megaphone,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import GradientSkeleton from "./GradientSkeleton";
import { PACKAGING_LIMITS } from "@/types/feature/packaging";

interface HooksCardProps {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
  isLoading: boolean;
  error?: string | null;
  onRegenerateAll: () => void;
  onEditOpeningLine?: (value: string) => void;
  onEditPatternInterrupt?: (value: string) => void;
  onEditCtaHook?: (value: string) => void;
}

interface HookItemProps {
  label: string;
  icon: React.ReactNode;
  content: string;
  isLoading: boolean;
  accentColor: string;
  borderColor: string;
  limit: number;
  onEdit?: (value: string) => void;
}

const HookItem = ({
  label,
  icon,
  content,
  isLoading,
  accentColor,
  borderColor,
  limit,
  onEdit,
}: HookItemProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const charCount = content.length;
  const isOverLimit = charCount > limit;
  const isNearLimit = charCount > limit * 0.9;

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

  const handleSave = () => {
    if (onEdit && editValue !== content) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl p-4",
        "bg-slate-800/30 border",
        borderColor,
        "transition-all duration-300",
        "hover:bg-slate-800/50",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm", accentColor)}>{icon}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
        {!isLoading && content && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-slate-200"
                onClick={() => {
                  setEditValue(content);
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-slate-200"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
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
              "w-full resize-none rounded-lg border bg-slate-900/50 p-2",
              "text-sm text-slate-200",
              "focus:outline-none focus:ring-1 focus:ring-violet-500/50",
              isOverLimit ? "border-red-500/50" : "border-slate-600/50",
            )}
            rows={3}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit ? "text-red-400" : "text-slate-500",
              )}
            >
              {charCount}/{limit}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-slate-400"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-6 bg-violet-600 text-xs hover:bg-violet-500"
                onClick={handleSave}
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : content ? (
        <>
          <p className="text-sm leading-relaxed text-slate-300">"{content}"</p>
          <div className="mt-2 flex justify-end">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit
                  ? "text-red-400"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-slate-500",
              )}
            >
              {charCount}/{limit}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm italic text-slate-500">Not generated yet</p>
      )}
    </div>
  );
};

const HooksCard = ({
  openingLine,
  patternInterrupt,
  ctaHook,
  isLoading,
  error,
  onRegenerateAll,
  onEditOpeningLine,
  onEditPatternInterrupt,
  onEditCtaHook,
}: HooksCardProps) => {
  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-slate-600/50",
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
              <h3 className="font-semibold tracking-tight text-slate-100">
                Hooks
              </h3>
              <p className="text-xs text-slate-500">
                Attention-grabbing content hooks
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
              isLoading && "[&_svg]:animate-spin",
            )}
            onClick={onRegenerateAll}
            disabled={isLoading}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate All
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Hooks Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <HookItem
            label="Opening Line"
            icon={<MessageCircle className="h-4 w-4" />}
            content={openingLine}
            isLoading={isLoading}
            accentColor="text-emerald-400"
            borderColor="border-emerald-500/20 hover:border-emerald-500/40"
            limit={PACKAGING_LIMITS.openingHook}
            onEdit={onEditOpeningLine}
          />
          <HookItem
            label="Pattern Interrupt"
            icon={<Zap className="h-4 w-4" />}
            content={patternInterrupt}
            isLoading={isLoading}
            accentColor="text-amber-400"
            borderColor="border-amber-500/20 hover:border-amber-500/40"
            limit={PACKAGING_LIMITS.patternInterrupt}
            onEdit={onEditPatternInterrupt}
          />
          <HookItem
            label="CTA Hook"
            icon={<Megaphone className="h-4 w-4" />}
            content={ctaHook}
            isLoading={isLoading}
            accentColor="text-rose-400"
            borderColor="border-rose-500/20 hover:border-rose-500/40"
            limit={PACKAGING_LIMITS.ctaHook}
            onEdit={onEditCtaHook}
          />
        </div>
      </div>
    </div>
  );
};

export default HooksCard;

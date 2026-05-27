import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Pencil,
  X,
  Type,
  Star,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import GradientSkeleton from "./GradientSkeleton";
import { PACKAGING_LIMITS, type ITitle } from "@/types/feature/packaging";
import { FeedbackButtons } from "@/components/research/FeedbackButtons";

interface TitlesCardProps {
  titles: ITitle[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  onSelectTitle: (index: number) => void;
  onEditTitle: (index: number, value: string) => void;
  feedback?: "like" | "dislike" | null;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
}

interface TitleItemProps {
  title: string;
  index: number;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
  onEdit: (value: string) => void;
}

const TitleItem = ({
  title,
  index,
  isSelected,
  isLoading,
  onSelect,
  onEdit,
}: TitleItemProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const charCount = title?.length || 0;
  const isOverLimit = charCount > PACKAGING_LIMITS.title;
  const isNearLimit = charCount > PACKAGING_LIMITS.title * 0.9;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      toastSuccess("Title copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Failed to copy");
    }
  };

  const handleSave = () => {
    if (editValue !== title) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(title);
    setIsEditing(true);
  };

  return (
    <button
      type="button"
      onClick={() => !isEditing && onSelect()}
      className={cn(
        "group relative w-full text-left rounded-xl p-4",
        "border transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      )}
    >
      {/* Selection indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isSelected && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary">Selected</span>
          </div>
        )}
        {!isLoading && title && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit title"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleStartEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy title"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
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

      {/* Variation label */}
      <div className="mb-2 flex items-center gap-2">
        <span className={cn(
          "text-xs font-medium uppercase tracking-wider",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}>
          Option {index + 1}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <GradientSkeleton lines={1} />
      ) : isEditing ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn(
              "w-full rounded-lg border bg-white/5 px-3 py-2",
              "text-base font-medium text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              isOverLimit ? "border-destructive/50" : "border-white/10"
            )}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {editValue.length}/{PACKAGING_LIMITS.title}
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
      ) : title ? (
        <>
          <p className={cn(
            "text-base font-medium leading-relaxed pr-20",
            isSelected ? "text-foreground" : "text-foreground/80"
          )}>
            {title}
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
              {charCount}/{PACKAGING_LIMITS.title}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm italic text-muted-foreground">Not generated yet</p>
      )}
    </button>
  );
};

const TitlesCard = ({
  titles,
  selectedIndex,
  isLoading,
  error,
  onRegenerate,
  onSelectTitle,
  onEditTitle,
  feedback,
  onFeedback,
}: TitlesCardProps) => {

  // Show 3 placeholders when loading or when no titles yet
  const displayTitles: (ITitle | null)[] =
    titles.length > 0 ? titles : [null, null, null];

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-white/20"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
              <Type className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Titles
              </h3>
              <p className="text-xs text-muted-foreground">
                Choose from 3 AI-generated options
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onFeedback && (
              <FeedbackButtons
                topicId="title"
                feedback={feedback ?? null}
                onFeedback={(_id, fb) => onFeedback(fb)}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              aria-label="Regenerate titles"
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-white/5",
                isLoading && "[&_svg]:motion-safe:animate-spin"
              )}
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Title variations */}
        <div className="space-y-3">
          {displayTitles.map((titleObj, index) => (
            <TitleItem
              key={index}
              title={titleObj?.title || ""}
              index={index}
              isSelected={selectedIndex === index && titles.length > 0}
              isLoading={isLoading}
              onSelect={() => onSelectTitle(index)}
              onEdit={(value) => onEditTitle(index, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TitlesCard;

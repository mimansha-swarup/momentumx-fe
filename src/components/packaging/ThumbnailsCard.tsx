import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Check, Image, Star } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import GradientSkeleton from "./GradientSkeleton";
import { FeedbackButtons } from "@/components/research/FeedbackButtons";

interface ThumbnailsCardProps {
  descriptions: string[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  onSelectThumbnail: (index: number) => void;
  feedback?: "like" | "dislike" | null;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
}

interface ThumbnailItemProps {
  thumbnail: string | null;
  index: number;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

const ThumbnailItem = ({
  thumbnail,
  index,
  isSelected,
  isLoading,
  onSelect,
}: ThumbnailItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!thumbnail) return;

    try {
      await navigator.clipboard.writeText(thumbnail);
      setCopied(true);
      toastSuccess("Thumbnail brief copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full text-left rounded-xl p-4",
        "border transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      )}
    >
      {/* Selection indicator and actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isSelected && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <Star className="h-3 w-3 text-emerald-400 fill-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              Selected
            </span>
          </div>
        )}
        {!isLoading && thumbnail && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy thumbnail brief"
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
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            isSelected ? "text-emerald-400" : "text-muted-foreground"
          )}
        >
          Variation {index + 1}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <GradientSkeleton lines={4} />
      ) : thumbnail ? (
        <p
          className={cn(
            "text-sm leading-relaxed",
            isSelected ? "text-foreground" : "text-foreground/80"
          )}
        >
          {thumbnail}
        </p>
      ) : (
        <p className="text-sm italic text-muted-foreground">Not generated yet</p>
      )}
    </button>
  );
};

const ThumbnailsCard = ({
  descriptions,
  selectedIndex,
  isLoading,
  error,
  onRegenerate,
  onSelectThumbnail,
  feedback,
  onFeedback,
}: ThumbnailsCardProps) => {
  // Show 3 placeholders when loading or when no descriptions yet
  const displayDescriptions: (string | null)[] =
    descriptions.length > 0 ? descriptions : [null, null, null];

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-white/20"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <Image className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Thumbnail Briefs
              </h3>
              <p className="text-xs text-muted-foreground">
                Choose from 3 creative directions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onFeedback && (
              <FeedbackButtons
                topicId="thumbnail"
                feedback={feedback ?? null}
                onFeedback={(_id, fb) => onFeedback(fb)}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              aria-label="Regenerate thumbnails"
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

        {/* Thumbnail variations */}
        <div className="grid gap-4 lg:grid-cols-3">
          {displayDescriptions.map((thumbnail, index) => (
            <ThumbnailItem
              key={index}
              thumbnail={thumbnail}
              index={index}
              isSelected={selectedIndex === index && descriptions.length > 0}
              isLoading={isLoading}
              onSelect={() => onSelectThumbnail(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailsCard;

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Image,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import GradientSkeleton from "./GradientSkeleton";
import type { IThumbnailDescription } from "@/types/feature/packaging";

interface ThumbnailsCardProps {
  descriptions: IThumbnailDescription[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  onSelectThumbnail: (index: number) => void;
}

interface ThumbnailItemProps {
  thumbnail: IThumbnailDescription | null;
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!thumbnail) return;

    const fullText = `Visual Concept: ${thumbnail.visual_concept}
Composition: ${thumbnail.composition}
Text Overlay: ${thumbnail.text_overlay}
Colors: ${thumbnail.colors}
Facial Expression: ${thumbnail.facial_expression}
Style References: ${thumbnail.style_references}
Reasoning: ${thumbnail.reasoning}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Thumbnail brief copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative rounded-xl p-4 cursor-pointer",
        "border transition-all duration-300",
        isSelected
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
      )}
    >
      {/* Selection indicator and actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isSelected && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <Star className="h-3 w-3 text-emerald-400 fill-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Selected</span>
          </div>
        )}
        {!isLoading && thumbnail && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Variation label */}
      <div className="mb-3 flex items-center gap-2">
        <span className={cn(
          "text-xs font-medium uppercase tracking-wider",
          isSelected ? "text-emerald-400" : "text-slate-500"
        )}>
          Variation {index + 1}
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <GradientSkeleton lines={4} />
      ) : thumbnail ? (
        <div className="space-y-3">
          {/* Visual Concept - Always visible */}
          <div>
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Visual Concept
            </span>
            <p className={cn(
              "mt-1 text-sm font-medium leading-relaxed",
              isSelected ? "text-slate-100" : "text-slate-200"
            )}>
              {thumbnail.visual_concept}
            </p>
          </div>

          {/* Text Overlay */}
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Text Overlay
            </span>
            <p className="mt-1 text-sm text-slate-300 font-semibold">
              "{thumbnail.text_overlay}"
            </p>
          </div>

          {/* Expandable details */}
          {isExpanded && (
            <div className="space-y-3 pt-2 border-t border-slate-700/50">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Composition
                </span>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {thumbnail.composition}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Colors
                </span>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {thumbnail.colors}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Facial Expression
                </span>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {thumbnail.facial_expression}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Style References
                </span>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {thumbnail.style_references}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Reasoning
                </span>
                <p className="mt-1 text-sm text-slate-400 italic leading-relaxed">
                  {thumbnail.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* Expand/Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                Show Details
              </>
            )}
          </Button>
        </div>
      ) : (
        <p className="text-sm italic text-slate-500">Not generated yet</p>
      )}
    </div>
  );
};

const ThumbnailsCard = ({
  descriptions,
  selectedIndex,
  isLoading,
  error,
  onRegenerate,
  onSelectThumbnail,
}: ThumbnailsCardProps) => {
  // Show 3 placeholders when loading or when no descriptions yet
  const displayDescriptions: (IThumbnailDescription | null)[] =
    descriptions.length > 0 ? descriptions : [null, null, null];

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-slate-600/50"
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
              <h3 className="font-semibold tracking-tight text-slate-100">
                Thumbnail Briefs
              </h3>
              <p className="text-xs text-slate-500">
                Choose from 3 creative directions
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
              isLoading && "[&_svg]:animate-spin"
            )}
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
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

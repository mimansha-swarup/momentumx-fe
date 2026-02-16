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
import { toast } from "sonner";
import GradientSkeleton from "./GradientSkeleton";
import { PACKAGING_LIMITS, type ITitle } from "@/types/feature/packaging";

interface TitlesCardProps {
  titles: ITitle[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  onSelectTitle: (index: number) => void;
  onEditTitle: (index: number, value: string) => void;
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
      toast.success("Title copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
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
    <div
      onClick={() => !isEditing && onSelect()}
      className={cn(
        "group relative rounded-xl p-4 cursor-pointer",
        "border transition-all duration-300",
        isSelected
          ? "bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10"
          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
      )}
    >
      {/* Selection indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isSelected && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30">
            <Star className="h-3 w-3 text-violet-400 fill-violet-400" />
            <span className="text-xs font-medium text-violet-400">Selected</span>
          </div>
        )}
        {!isLoading && title && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-slate-200"
              onClick={handleStartEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
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
      <div className="mb-2 flex items-center gap-2">
        <span className={cn(
          "text-xs font-medium uppercase tracking-wider",
          isSelected ? "text-violet-400" : "text-slate-500"
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
              "w-full rounded-lg border bg-slate-900/50 px-3 py-2",
              "text-base font-medium text-slate-200",
              "focus:outline-none focus:ring-2 focus:ring-violet-500/50",
              isOverLimit ? "border-red-500/50" : "border-slate-600/50"
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
                isOverLimit ? "text-red-400" : "text-slate-500"
              )}
            >
              {editValue.length}/{PACKAGING_LIMITS.title}
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
      ) : title ? (
        <>
          <p className={cn(
            "text-base font-medium leading-relaxed pr-20",
            isSelected ? "text-slate-100" : "text-slate-300"
          )}>
            {title}
          </p>
          <div className="mt-2 flex justify-end">
            <span
              className={cn(
                "text-xs tabular-nums",
                isOverLimit
                  ? "text-red-400"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-slate-500"
              )}
            >
              {charCount}/{PACKAGING_LIMITS.title}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm italic text-slate-500">Not generated yet</p>
      )}
    </div>
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
}: TitlesCardProps) => {

  // Show 3 placeholders when loading or when no titles yet
  const displayTitles: (ITitle | null)[] =
    titles.length > 0 ? titles : [null, null, null];

  return (
    <div
      className={cn(
        "glass-card",
        "transition-all duration-300",
        "hover:border-slate-600/50"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Type className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-slate-100">
                Titles
              </h3>
              <p className="text-xs text-slate-500">
                Choose from 3 AI-generated options
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

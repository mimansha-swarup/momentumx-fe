import { useEffect, useState } from "react";
import { Loader2, Sparkles, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEEP_LOADING_STEPS = [
  "Researching...",
  "Analyzing content...",
  "Scanning trending titles...",
  "Identifying patterns...",
  "Scoring variations...",
  "Crafting titles...",
];
const STEP_INTERVAL_MS = 1800;

function useDeepLoadingStep(isDeepLoading: boolean): string {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isDeepLoading) {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStepIndex((prev) =>
        prev < DEEP_LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isDeepLoading]);

  return DEEP_LOADING_STEPS[stepIndex];
}

const MAX_IDEA_LENGTH = 500;
const MAX_SCRIPT_LENGTH = 5000;

interface InputSectionProps {
  idea: string;
  script: string;
  isLoading: boolean;
  isDeepLoading: boolean;
  hasResults: boolean;
  onIdeaChange: (value: string) => void;
  onScriptChange: (value: string) => void;
  onGenerate: () => void;
  onDeepGenerate: () => void;
  onClear: () => void;
}

export const InputSection = ({
  idea,
  script,
  isLoading,
  isDeepLoading,
  hasResults,
  onIdeaChange,
  onScriptChange,
  onGenerate,
  onDeepGenerate,
  onClear,
}: InputSectionProps) => {
  const isAnyLoading = isLoading || isDeepLoading;
  const hasInput = idea.trim().length > 0 || script.trim().length > 0;
  const deepLoadingStep = useDeepLoadingStep(isDeepLoading);

  return (
    <section aria-label="Title generator input">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Idea textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="title-gen-idea"
              className="text-label text-sm font-medium"
            >
              Your Idea
              <span className="text-muted-foreground ml-1.5 text-xs font-normal">(optional)</span>
            </label>
            <span
              className={cn(
                "text-xs tabular-nums",
                idea.length > MAX_IDEA_LENGTH * 0.9
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {idea.length}/{MAX_IDEA_LENGTH}
            </span>
          </div>
          <textarea
            id="title-gen-idea"
            value={idea}
            onChange={(e) => onIdeaChange(e.target.value)}
            placeholder="Describe your video idea in a few sentences..."
            maxLength={MAX_IDEA_LENGTH}
            disabled={isAnyLoading}
            rows={5}
            className={cn(
              "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-describedby="title-gen-hint"
          />
        </div>

        {/* Script textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="title-gen-script"
              className="text-label text-sm font-medium"
            >
              Your Script
              <span className="text-muted-foreground ml-1.5 text-xs font-normal">(optional)</span>
            </label>
            <span
              className={cn(
                "text-xs tabular-nums",
                script.length > MAX_SCRIPT_LENGTH * 0.9
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {script.length}/{MAX_SCRIPT_LENGTH}
            </span>
          </div>
          <textarea
            id="title-gen-script"
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Paste your script or outline here for more accurate results..."
            maxLength={MAX_SCRIPT_LENGTH}
            disabled={isAnyLoading}
            rows={5}
            className={cn(
              "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>
      </div>

      <p id="title-gen-hint" className="text-caption text-xs mb-4">
        Fill in at least one field — idea or script — to generate titles.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={onGenerate}
          disabled={isAnyLoading || !hasInput}
          className="btn-outline-hover"
          aria-label="Generate titles"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Generate
        </Button>

        <div className="relative group/deep">
          <Button
            onClick={onDeepGenerate}
            disabled={isAnyLoading || !hasInput}
            className="btn-primary-glow"
            aria-label="Deep generate titles with deeper analysis"
            aria-describedby="deep-generate-tooltip"
          >
            {isDeepLoading ? (
              <Loader2 className="size-4 animate-spin shrink-0" />
            ) : (
              <Zap className="size-4 shrink-0" />
            )}
            <span className={cn("transition-all duration-300", isDeepLoading && "tabular-nums")}>
              {isDeepLoading ? deepLoadingStep : "Deep Generate"}
            </span>
          </Button>
          <span
            id="deep-generate-tooltip"
            role="tooltip"
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 text-center",
              "text-xs text-foreground bg-secondary border border-white/10 rounded-lg px-3 py-2",
              "opacity-0 group-hover/deep:opacity-100 pointer-events-none transition-opacity duration-200",
              "shadow-lg z-10"
            )}
          >
            Performs deeper pattern analysis for higher quality, more optimized title suggestions
          </span>
        </div>

        {hasResults && (
          <Button
            variant="ghost"
            onClick={onClear}
            disabled={isAnyLoading}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear results and reset"
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>
    </section>
  );
};

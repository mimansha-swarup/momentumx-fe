import { useCallback, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import Header from "@/components/shared/header";
import { TitleCard, TitleCardSkeleton, AnalysisBadges, InputSection } from "@/components/titleGenerator";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectTitleGeneratorTitles,
  selectTitleGeneratorAnalysis,
  selectTitleGeneratorIsLoading,
  selectTitleGeneratorIsDeepLoading,
  selectTitleGeneratorError,
  selectTitleGeneratorMode,
  clearResult,
} from "@/utils/feature/titleGenerator/titleGenerator.slice";
import { generateTitles, deepGenerateTitles } from "@/utils/feature/titleGenerator/titleGenerator.thunk";
import { toastError } from "@/utils/toast";

const SKELETON_COUNT = 10;

const TitleGeneratorPage = () => {
  const dispatch = useAppDispatch();

  const titles = useAppSelector(selectTitleGeneratorTitles);
  const analysis = useAppSelector(selectTitleGeneratorAnalysis);
  const isLoading = useAppSelector(selectTitleGeneratorIsLoading);
  const isDeepLoading = useAppSelector(selectTitleGeneratorIsDeepLoading);
  const error = useAppSelector(selectTitleGeneratorError);
  const generationMode = useAppSelector(selectTitleGeneratorMode);

  const [idea, setIdea] = useState("");
  const [script, setScript] = useState("");

  const isAnyLoading = isLoading || isDeepLoading;
  const hasResults = titles.length > 0;

  const getPayload = useCallback(() => {
    const payload: { idea?: string; script?: string } = {};
    const trimmedIdea = idea.trim();
    const trimmedScript = script.trim();

    if (!trimmedIdea && !trimmedScript) {
      toastError("Please fill in at least one field — idea or script.");
      return null;
    }

    if (trimmedIdea) payload.idea = trimmedIdea;
    if (trimmedScript) payload.script = trimmedScript;
    return payload;
  }, [idea, script]);

  const handleGenerate = useCallback(() => {
    const payload = getPayload();
    if (!payload) return;
    dispatch(generateTitles(payload));
  }, [dispatch, getPayload]);

  const handleDeepGenerate = useCallback(() => {
    const payload = getPayload();
    if (!payload) return;
    dispatch(deepGenerateTitles(payload));
  }, [dispatch, getPayload]);

  const handleClear = useCallback(() => {
    dispatch(clearResult());
    setIdea("");
    setScript("");
  }, [dispatch]);

  return (
    <div className="md:w-[90%] mx-auto pb-20">
      <Header title="Title Generator" />

      {/* Input section */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <InputSection
          idea={idea}
          script={script}
          isLoading={isLoading}
          isDeepLoading={isDeepLoading}
          hasResults={hasResults}
          onIdeaChange={setIdea}
          onScriptChange={setScript}
          onGenerate={handleGenerate}
          onDeepGenerate={handleDeepGenerate}
          onClear={handleClear}
        />
      </div>

      {/* Error state */}
      {error && !isAnyLoading && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-6"
        >
          {error}
        </div>
      )}

      {/* Empty state — before any generation */}
      {!hasResults && !isAnyLoading && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="icon-container mb-4">
            <Sparkles className="size-6" />
          </div>
          <h2 className="text-title text-xl mb-2">Ready to craft the perfect title</h2>
          <p className="text-label max-w-sm">
            Enter your idea or paste your script above, then hit Generate or Deep Generate to get AI-scored title suggestions.
          </p>
        </div>
      )}

      {/* Results section */}
      {(hasResults || isAnyLoading) && (
        <section aria-label="Generated title suggestions" aria-live="polite" aria-busy={isAnyLoading}>
          {/* Generation mode tag + analysis badges */}
          {!isAnyLoading && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {generationMode === "deep" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 border border-primary/40 text-primary">
                  <Zap className="size-3" />
                  Deeply Researched
                </span>
              ) : generationMode === "normal" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/15 text-muted-foreground">
                  <Sparkles className="size-3" />
                  Generated
                </span>
              ) : null}
            </div>
          )}
          {analysis && !isAnyLoading && (
            <AnalysisBadges analysis={analysis} />
          )}

          {/* Title cards */}
          <div className="space-y-3">
            {isAnyLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <TitleCardSkeleton key={i} />
                ))
              : titles.map((titleItem, index) => (
                  <TitleCard
                    key={`${titleItem.title}-${index}`}
                    title={titleItem}
                    rank={index + 1}
                    style={{ animationDelay: `${index * 80}ms` }}
                  />
                ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TitleGeneratorPage;

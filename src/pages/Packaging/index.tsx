import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ScriptInput,
  OutputCard,
  TitlesCard,
  ThumbnailsCard,
  HooksParagraphCard,
  ShortsScriptCard,
} from "@/components/packaging";
import {
  selectPackaging,
  selectCanAddMoreShorts,
  selectHasContent,
  setScript,
  updateTitleVariation,
  setSelectedTitle,
  updateDescription,
  setSelectedThumbnail,
  updateHook,
  deleteHook,
  deleteShortsScript,
  resetPackaging,
} from "@/utils/feature/packaging/packaging.slice";
import {
  generateTitle,
  generateDescription,
  generateThumbnail,
  generateHooks,
  addNewShortsScript,
  regenerateShortsScript,
  generateAllPackaging,
  savePackaging,
} from "@/utils/feature/packaging/packaging.thunk";
import { PACKAGING_LIMITS } from "@/types/feature/packaging";
import {
  Menu,
  Package,
  FileText,
  Save,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toastError, toastInfo } from "@/utils/toast";

const PackagingPage = () => {
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useSidebar();
  const {
    script,
    titles,
    description,
    thumbnails,
    hooks,
    shortsScript,
    isSaving,
    isGeneratingAll,
  } = useAppSelector(selectPackaging);
  const canAddMoreShorts = useAppSelector(selectCanAddMoreShorts);
  const hasContent = useAppSelector(selectHasContent);

  const isAnyShortsLoading = shortsScript.scripts.some((s) => s.isLoading);

  const isAnyLoading =
    titles.isLoading ||
    description.isLoading ||
    thumbnails.isLoading ||
    hooks.isLoading ||
    isAnyShortsLoading ||
    shortsScript.isAddingNew;

  const handleGenerateAll = () => {
    if (!script.trim()) {
      toastError("Please enter a podcast script first");
      return;
    }
    dispatch(generateAllPackaging());
  };

  const handleSave = async () => {
    if (!hasContent) {
      toastError("Generate some content first");
      return;
    }
    const result = await dispatch(savePackaging());
    if (savePackaging.rejected.match(result)) {
      toastError("Failed to save packaging");
    }
  };

  const handleReset = () => {
    dispatch(resetPackaging());
    toastInfo("All content has been cleared");
  };

  const handleAddNewShorts = () => {
    if (!script.trim()) {
      toastError("Please enter a podcast script first");
      return;
    }
    dispatch(addNewShortsScript());
  };

  const handleRegenerateShorts = (scriptId: string) => {
    dispatch(regenerateShortsScript(scriptId));
  };

  const handleDeleteShorts = (scriptId: string) => {
    dispatch(deleteShortsScript(scriptId));
    toastInfo("Script variation removed");
  };

  return (
    <div className="min-h-screen ">
      {/* Animated background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl motion-safe:animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent blur-3xl motion-safe:animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              className="block md:hidden"
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/25">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Transform your script into marketing assets
                </h1>
                <p className="text-sm text-muted-foreground">Packaging</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {hasContent && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                onClick={handleReset}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasContent || isSaving || isAnyLoading}
              className={cn(
                "bg-gradient-to-r from-emerald-600 to-teal-600",
                "hover:from-emerald-500 hover:to-teal-500",
                "shadow-lg shadow-emerald-500/20",
                "disabled:opacity-50"
              )}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 motion-safe:animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save All
            </Button>
          </div>
        </header>

        {/* Script Input Section */}
        <section className="mb-8">
          <ScriptInput
            value={script}
            onChange={(value) => dispatch(setScript(value))}
            onGenerate={handleGenerateAll}
            isGenerating={isGeneratingAll || isAnyLoading}
          />
        </section>

        {/* Output Cards */}
        <section className="space-y-6">
          {/* Titles - 3 variations */}
          <TitlesCard
            titles={titles.titles}
            selectedIndex={titles.selectedIndex}
            isLoading={titles.isLoading}
            error={titles.error}
            onRegenerate={() => dispatch(generateTitle())}
            onSelectTitle={(index) => dispatch(setSelectedTitle(index))}
            onEditTitle={(index, value) =>
              dispatch(updateTitleVariation({ index, value }))
            }
          />

          {/* Description Card */}
          <OutputCard
            title="Description"
            icon={<FileText className="h-4 w-4" />}
            content={description.content}
            isLoading={description.isLoading}
            error={description.error}
            characterLimit={PACKAGING_LIMITS.description}
            onRegenerate={() => dispatch(generateDescription())}
            onEdit={(value) => dispatch(updateDescription(value))}
            accentColor="blue"
            skeletonLines={8}
          />

          {/* Thumbnails - 3 variations */}
          <ThumbnailsCard
            descriptions={thumbnails.descriptions}
            selectedIndex={thumbnails.selectedIndex}
            isLoading={thumbnails.isLoading}
            error={thumbnails.error}
            onRegenerate={() => dispatch(generateThumbnail())}
            onSelectThumbnail={(index) => dispatch(setSelectedThumbnail(index))}
          />

          {/* Hooks - Paragraph style */}
          <HooksParagraphCard
            hooks={hooks.hooks}
            isLoading={hooks.isLoading}
            error={hooks.error}
            onRegenerate={() => dispatch(generateHooks())}
            onEditHook={(index, value) =>
              dispatch(updateHook({ index, value }))
            }
            onDeleteHook={(index) => dispatch(deleteHook(index))}
          />

          {/* Shorts Scripts - Multiple variations */}
          <ShortsScriptCard
            scripts={shortsScript.scripts}
            isAddingNew={shortsScript.isAddingNew}
            canAddMore={canAddMoreShorts}
            onAddNew={handleAddNewShorts}
            onRegenerate={handleRegenerateShorts}
            onDelete={handleDeleteShorts}
          />
        </section>

        {/* Footer note */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Generated content is AI-assisted. Review and edit before
            publishing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackagingPage;

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Youtube,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GRADIENT_BUTTON_CSS } from "@/constants/root";

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

type InputTab = "paste" | "youtube";

const ScriptInput = ({
  value,
  onChange,
  onGenerate,
  isGenerating,
  disabled = false,
}: ScriptInputProps) => {
  const [activeTab, setActiveTab] = useState<InputTab>("paste");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const minWords = 100;
  const isValid = wordCount >= minWords;

  return (
    <div className={"glass-card"}>
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-violet-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100" />

      <div className="relative z-10">
        {/* Tab Header */}
        <div className="flex items-center gap-1 border-b border-slate-700/50 p-2">
          <button
            onClick={() => setActiveTab("paste")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === "paste"
                ? "bg-gradient-to-r from-violet-600/20 to-blue-600/20 text-white shadow-lg shadow-violet-500/10"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
            )}
          >
            <FileText className="h-4 w-4" />
            Paste Script
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            disabled
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              "text-slate-500 cursor-not-allowed opacity-60",
            )}
          >
            <Youtube className="h-4 w-4" />
            YouTube Link
            <Badge
              variant="outline"
              className="ml-1 border-slate-600 bg-slate-800/50 text-[10px] text-slate-400"
            >
              Coming Soon
            </Badge>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5">
          {activeTab === "paste" ? (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled || isGenerating}
                  placeholder="Paste your podcast script here... The more detailed your script, the better the generated content will be."
                  className={cn(
                    "min-h-[200px] w-full resize-none rounded-xl border bg-slate-800/30 p-4",
                    "text-sm leading-relaxed text-slate-200 placeholder:text-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/30",
                    "transition-all duration-200",
                    isGenerating ? "opacity-50" : "",
                    !isValid && value.length > 0
                      ? "border-amber-500/50"
                      : "border-slate-700/50 focus:border-violet-500/50",
                  )}
                />

                {/* Floating word count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      !isValid && value.length > 0
                        ? "text-amber-400"
                        : "text-slate-500",
                    )}
                  >
                    {wordCount.toLocaleString()} words
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {charCount.toLocaleString()} chars
                  </span>
                </div>
              </div>

              {/* Validation message */}
              {!isValid && value.length > 0 && (
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">
                    Add at least {minWords - wordCount} more words for better
                    results
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled
                  placeholder="https://youtube.com/watch?v=..."
                  className={cn(
                    "w-full rounded-xl border border-slate-700/50 bg-slate-800/30 p-4",
                    "text-sm text-slate-200 placeholder:text-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/30",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                />
              </div>
              <p className="text-xs text-slate-500">
                YouTube link import will be available soon. For now, please copy
                and paste your script directly.
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="border-t border-slate-700/50 bg-slate-900/50 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Generate title, description, thumbnail brief, hooks, and YT Shorts
              script
            </p>
            <Button
              onClick={onGenerate}
              disabled={!isValid || isGenerating || disabled}
              className={GRADIENT_BUTTON_CSS}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate All Assets
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptInput;

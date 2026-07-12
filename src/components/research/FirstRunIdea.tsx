import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/shared/glassCard";
import {
  prefillFromChannel,
  completeOnboarding,
} from "@/utils/feature/user/user.thunk";
import {
  selectIsPrefilling,
  selectUserError,
} from "@/utils/feature/user/user.slice";
import { generateTitles } from "@/utils/feature/titles/titles.thunk";
import {
  selectTitlesLoading,
  selectTitlesError,
} from "@/utils/feature/titles/titles.slice";
import type { IIdeaContextOverride } from "@/service/titles";

// Value-first first-run entry (§5.1): a contextless user gets instant ideas from
// their channel URL (or niche+audience) before any setup. The credential they
// type is persisted in the background as their minimum — no wall, no re-ask.
export const FirstRunIdea = () => {
  const dispatch = useAppDispatch();
  const isPrefilling = useAppSelector(selectIsPrefilling);
  const isGenerating = useAppSelector(selectTitlesLoading);
  const prefillError = useAppSelector(selectUserError);
  const genError = useAppSelector(selectTitlesError);

  const [channelUrl, setChannelUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [manual, setManual] = useState(false);

  const busy = isPrefilling || isGenerating;
  const error = genError || prefillError;

  const runUrl = async () => {
    const url = channelUrl.trim();
    if (!url) return;
    // Read the channel first — its inferred niche/audience/titles become the
    // transient context that grounds the instant first ideas.
    const pre = await dispatch(prefillFromChannel(url));
    if (!prefillFromChannel.fulfilled.match(pre) || !pre.payload) return;
    const s = pre.payload.suggestions;
    const ctx: IIdeaContextOverride = {
      niche: s.niche,
      targetAudience: s.targetAudience,
      brandName: s.brandName,
      topTitles: pre.payload.channel.topTitles,
    };
    await dispatch(generateTitles(ctx)); // the aha — ideas render on success
    dispatch(completeOnboarding({ userName: url })); // background: persist the minimum
  };

  const runManual = async () => {
    const n = niche.trim();
    const a = targetAudience.trim();
    if (!n || !a) return;
    await dispatch(generateTitles({ niche: n, targetAudience: a }));
    dispatch(completeOnboarding({ niche: n, targetAudience: a }));
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <GlassCard className="w-full max-w-lg p-8">
        <h2 className="text-heading-lg mb-2">What&apos;s your next video?</h2>
        <p className="text-label mb-6">
          Drop your YouTube channel URL — we&apos;ll read your channel and
          generate your first ideas. No setup required.
        </p>

        {!manual ? (
          <div className="space-y-2">
            <Label htmlFor="channelUrl">YouTube channel URL</Label>
            <Input
              id="channelUrl"
              placeholder="https://youtube.com/@yourchannel"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              disabled={busy}
            />
            <Button
              className="btn-primary-glow w-full mt-4"
              onClick={runUrl}
              disabled={!channelUrl.trim() || busy}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" aria-hidden="true" />
                  {isPrefilling ? "Reading your channel…" : "Finding ideas…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-1" /> Generate my first ideas
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setManual(true)}
              disabled={busy}
              className="text-sm text-primary underline block mt-4 mx-auto"
            >
              I don&apos;t have a channel URL
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g. AI productivity for founders"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g. solo founders and indie hackers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                disabled={busy}
              />
            </div>
            <Button
              className="btn-primary-glow w-full"
              onClick={runManual}
              disabled={!niche.trim() || !targetAudience.trim() || busy}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" aria-hidden="true" />
                  Finding ideas&hellip;
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-1" /> Generate my first ideas
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setManual(false)}
              disabled={busy}
              className="text-sm text-primary underline block mx-auto"
            >
              Use my channel URL instead
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive mt-4" role="alert">
            {error}
          </p>
        )}
      </GlassCard>
    </div>
  );
};

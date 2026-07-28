import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
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
  selectIsOnboarded,
  selectIsPrefilling,
  selectUserError,
} from "@/utils/feature/user/user.slice";
import { generateIdeas } from "@/utils/feature/ideas/ideas.thunk";
import {
  selectActiveIdeas,
  selectIdeasLoading,
  selectIdeasError,
} from "@/utils/feature/ideas/ideas.slice";
import type { IIdeaContextOverride } from "@/service/ideas";

type Phase = "input" | "confirm" | "ideas";

// A YouTube URL/handle looks like one of these — a loose check to catch obvious
// garbage before spending a prefill round-trip. The backend is the real validator.
const looksLikeYouTube = (v: string) => /youtube\.com|youtu\.be|^@/.test(v.trim());

// Gated value-first onboarding (§5.1 + Option A): a fresh user reads their channel
// URL → confirms/edits the detected context → sees their first ideas right here →
// continues to the dashboard. The confirm step keeps the inference transparent and
// lets us persist the REAL niche/audience/brand (not just the raw URL).
const OnboardingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOnboarded = useAppSelector(selectIsOnboarded);
  const isPrefilling = useAppSelector(selectIsPrefilling);
  const isGenerating = useAppSelector(selectIdeasLoading);
  const prefillError = useAppSelector(selectUserError);
  const genError = useAppSelector(selectIdeasError);
  const ideas = useAppSelector(selectActiveIdeas);

  // Already-onboarded users don't need the gate. Capture the value at mount so
  // completing onboarding in-session (which flips isOnboarded) can't redirect us
  // away from the final "ideas" step.
  const onboardedAtMount = useRef(isOnboarded).current;

  const [phase, setPhase] = useState<Phase>("input");
  const [manual, setManual] = useState(false);
  const [channelUrl, setChannelUrl] = useState("");
  const [urlHint, setUrlHint] = useState<string | null>(null);
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandName, setBrandName] = useState("");
  const topTitlesRef = useRef<string[]>([]);

  const busy = isPrefilling || isGenerating;
  const error = genError || prefillError;

  if (onboardedAtMount) return <Navigate to="/app/dashboard" replace />;

  // Step 1a — read the channel, then move to the confirm step
  const handleReadChannel = async () => {
    const url = channelUrl.trim();
    if (!url) return;
    if (!looksLikeYouTube(url)) {
      setUrlHint("That doesn't look like a YouTube channel URL.");
      return;
    }
    setUrlHint(null);
    const pre = await dispatch(prefillFromChannel(url));
    if (!prefillFromChannel.fulfilled.match(pre) || !pre.payload) {
      // Improvement #5 — couldn't read the channel → offer the manual path
      setManual(true);
      return;
    }
    const s = pre.payload.suggestions;
    setNiche(s.niche);
    setTargetAudience(s.targetAudience);
    setBrandName(s.brandName);
    topTitlesRef.current = pre.payload.channel.topTitles;
    setPhase("confirm");
  };

  // Step 2 — generate the first ideas from the confirmed context and persist it
  const handleGenerate = async () => {
    const n = niche.trim();
    const a = targetAudience.trim();
    if (!n || !a) return;
    const ctx: IIdeaContextOverride = {
      niche: n,
      targetAudience: a,
      ...(brandName.trim() && { brandName: brandName.trim() }),
      ...(topTitlesRef.current.length && { topTitles: topTitlesRef.current }),
    };
    const res = await dispatch(generateIdeas(ctx));
    if (!generateIdeas.fulfilled.match(res)) return; // error shown; stay put
    // Background: persist the real detected fields (not the URL) so the profile
    // and completeness score reflect what we actually inferred.
    dispatch(
      completeOnboarding({
        niche: n,
        targetAudience: a,
        ...(brandName.trim() && { brandName: brandName.trim() }),
        ...(channelUrl.trim() && { userName: channelUrl.trim() }),
      })
    );
    setPhase("ideas");
  };

  // Shared between the confirm phase and the manual-input path — same action,
  // same states, so the UX stays identical wherever the user generates from.
  const generateButton = (
    <Button
      className="btn-primary-glow w-full"
      onClick={handleGenerate}
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
  );

  const errorLine = error && (
    <p className="text-sm text-destructive mt-4" role="alert">
      {error}
    </p>
  );

  // ---- Phase: ideas (the aha) ----
  if (phase === "ideas") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-heading-xl mb-2">
              <span className="gradient-text">Here are your first ideas</span>
            </h1>
            <p className="text-label">
              Tailored to your niche. You can generate more, write scripts, and
              package them from your dashboard.
            </p>
          </div>
          <div className="space-y-3 mb-8">
            {ideas.slice(0, 3).map((idea) => (
              <GlassCard key={idea.id} className="p-5">
                <h3 className="text-title text-base mb-1">{idea.title}</h3>
                {idea.concept && (
                  <p className="text-label text-sm line-clamp-2">
                    {idea.concept}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
          <Button
            className="btn-primary-glow w-full"
            onClick={() => navigate("/app/dashboard")}
          >
            Continue to dashboard
            <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  // ---- Phase: confirm (edit the detected context) ----
  if (phase === "confirm") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <GlassCard className="w-full max-w-lg p-8">
          <h1 className="text-heading-lg mb-2">Here&apos;s what we found</h1>
          <p className="text-label mb-6">
            We read your channel. Tweak anything that&apos;s off, then we&apos;ll
            generate ideas tailored to it.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand name</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                disabled={busy}
              />
            </div>
            {generateButton}
          </div>
          {errorLine}
        </GlassCard>
      </div>
    );
  }

  // ---- Phase: input (URL or manual) ----
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <GlassCard className="w-full max-w-lg p-8">
        <h1 className="text-heading-lg mb-2">Let&apos;s set up your channel</h1>
        <p className="text-label mb-6">
          Drop your YouTube channel URL — we&apos;ll read it and generate your
          first ideas. No long forms.
        </p>

        {!manual ? (
          <div className="space-y-2">
            <Label htmlFor="channelUrl">YouTube channel URL</Label>
            <Input
              id="channelUrl"
              placeholder="https://youtube.com/@yourchannel"
              value={channelUrl}
              onChange={(e) => {
                setChannelUrl(e.target.value);
                if (urlHint) setUrlHint(null);
              }}
              disabled={busy}
            />
            {urlHint && (
              <p className="text-sm text-destructive" role="alert">
                {urlHint}
              </p>
            )}
            <Button
              className="btn-primary-glow w-full mt-4"
              onClick={handleReadChannel}
              disabled={!channelUrl.trim() || busy}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" aria-hidden="true" />
                  Reading your channel&hellip;
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-1" /> Continue
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
            {prefillError && (
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t read that channel — tell us your niche instead.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="niche-manual">Niche</Label>
              <Input
                id="niche-manual"
                placeholder="e.g. AI productivity for founders"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience-manual">Target audience</Label>
              <Input
                id="audience-manual"
                placeholder="e.g. solo founders and indie hackers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                disabled={busy}
              />
            </div>
            {generateButton}
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

        {!urlHint && errorLine}
      </GlassCard>
    </div>
  );
};

export default OnboardingPage;

import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/shared/glassCard";
import {
  currentUser,
  selectIsOnboarded,
  selectIsUpdating,
  selectPrefill,
} from "@/utils/feature/user/user.slice";
import { updateProfile } from "@/utils/feature/user/user.thunk";

// Progressive enrichment (§5.1 "ask after aha"): a dismissible nudge shown to a
// user who onboarded via URL only (channel saved, niche/audience still empty).
// Pre-filled from the inferred prefill suggestions. Never gates anything.
export const EnrichNudge = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);
  const isOnboarded = useAppSelector(selectIsOnboarded);
  const isUpdating = useAppSelector(selectIsUpdating);
  const prefill = useAppSelector(selectPrefill);

  const [dismissed, setDismissed] = useState(false);
  const [niche, setNiche] = useState(prefill?.suggestions.niche ?? "");
  const [targetAudience, setTargetAudience] = useState(
    prefill?.suggestions.targetAudience ?? ""
  );

  const incomplete = !user?.niche || !user?.targetAudience;
  // Only for onboarded-but-incomplete users; hidden during first-run and once filled.
  if (!isOnboarded || !incomplete || dismissed) return null;

  const save = async () => {
    const n = niche.trim();
    const a = targetAudience.trim();
    if (!n || !a) return;
    const res = await dispatch(updateProfile({ niche: n, targetAudience: a }));
    if (updateProfile.fulfilled.match(res)) setDismissed(true);
  };

  return (
    <GlassCard className="p-5 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-title">Sharpen your ideas</p>
          <p className="text-label">
            Confirm your niche and audience so future ideas sound like your channel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div className="space-y-2">
          <Label htmlFor="enrich-niche">Niche</Label>
          <Input
            id="enrich-niche"
            value={niche}
            placeholder="e.g. AI productivity for founders"
            onChange={(e) => setNiche(e.target.value)}
            disabled={isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enrich-audience">Target audience</Label>
          <Input
            id="enrich-audience"
            value={targetAudience}
            placeholder="e.g. solo founders and indie hackers"
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={isUpdating}
          />
        </div>
      </div>

      <div className="mt-4">
        <Button
          size="sm"
          className="btn-primary-glow"
          onClick={save}
          disabled={!niche.trim() || !targetAudience.trim() || isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="size-4 animate-spin mr-1" aria-hidden="true" />
          ) : (
            <Sparkles className="size-4 mr-1" />
          )}
          Save
        </Button>
      </div>
    </GlassCard>
  );
};

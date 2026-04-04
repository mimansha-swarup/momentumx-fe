import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StaleStepBannerProps {
  staleReason: 'script_regenerated' | 'hooks_regenerated' | null;
  onRegenerate?: () => void;
  onKeepAsIs?: () => void;
  isRegenerating?: boolean;
}

const STALE_MESSAGES: Record<
  NonNullable<StaleStepBannerProps['staleReason']>,
  string
> = {
  script_regenerated:
    "The script has been regenerated. This step's content may be outdated.",
  hooks_regenerated:
    'Hooks have been regenerated. Packaging content may need updating.',
};

export const StaleStepBanner: React.FC<StaleStepBannerProps> = ({
  staleReason,
  onRegenerate,
  onKeepAsIs,
  isRegenerating = false,
}) => {
  if (!staleReason) return null;

  const message = STALE_MESSAGES[staleReason];

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm',
        'sm:flex-row sm:items-center sm:justify-between',
      )}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400 sm:mt-0" />
        <p className="text-sm text-amber-200">{message}</p>
      </div>

      {(onRegenerate || onKeepAsIs) && (
        <div className="flex shrink-0 items-center gap-2">
          {onKeepAsIs && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onKeepAsIs}
              disabled={isRegenerating}
              className="text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
            >
              Keep as-is
            </Button>
          )}
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                  Regenerating…
                </>
              ) : (
                'Regenerate'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

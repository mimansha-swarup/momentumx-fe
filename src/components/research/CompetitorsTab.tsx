import { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import GlassCard from '@/components/shared/glassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ICompetitorChannel } from '@/types/feature/research';

interface CompetitorsTabProps {
  channels: ICompetitorChannel[];
  isLoading: boolean;
  error: string | null;
}

const COLLAPSED_LIMIT = 3;

const CompetitorChannelCard: React.FC<{ channel: ICompetitorChannel }> = ({ channel }) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = channel.titles.length > COLLAPSED_LIMIT;
  const visibleTitles = expanded ? channel.titles : channel.titles.slice(0, COLLAPSED_LIMIT);
  const hiddenCount = channel.titles.length - COLLAPSED_LIMIT;

  return (
    <GlassCard className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <h3 className="text-base font-medium text-foreground">{channel.channelTitle}</h3>
      </div>

      {channel.titles.length > 0 ? (
        <>
          <ul className="space-y-1.5" aria-label={`Videos from ${channel.channelTitle}`}>
            {visibleTitles.map((title, i) => (
              <li
                key={i}
                className={cn(
                  'text-sm text-muted-foreground pl-3 border-l border-white/10',
                  'transition-colors duration-200',
                )}
              >
                {title}
              </li>
            ))}
          </ul>

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((prev) => !prev)}
              className="self-start h-auto px-0 py-0 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" aria-hidden="true" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" aria-hidden="true" />
                  Show {hiddenCount} more
                </>
              )}
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No video titles available</p>
      )}
    </GlassCard>
  );
};

const CompetitorSkeletonCard: React.FC = () => (
  <GlassCard className="flex flex-col gap-3 p-4">
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-40 rounded" />
    </div>
    <Skeleton className="h-3 w-full rounded" />
    <Skeleton className="h-3 w-5/6 rounded" />
    <Skeleton className="h-3 w-4/6 rounded" />
  </GlassCard>
);

export const CompetitorsTab: React.FC<CompetitorsTabProps> = ({
  channels,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Loading competitor channels">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CompetitorSkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <Users className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Users className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">No competitor data available</p>
      </div>
    );
  }

  return (
    <section aria-label="Competitor channels">
      <div className="space-y-4">
        {channels.map((channel, i) => (
          <CompetitorChannelCard key={`${channel.channelTitle}-${i}`} channel={channel} />
        ))}
      </div>
    </section>
  );
};

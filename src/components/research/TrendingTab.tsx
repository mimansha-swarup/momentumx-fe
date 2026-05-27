import { ExternalLink, TrendingUp, User } from 'lucide-react';
import GlassCard from '@/components/shared/glassCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { ITrendingVideo } from '@/types/feature/research';

interface TrendingTabProps {
  videos: ITrendingVideo[];
  isLoading: boolean;
  error: string | null;
}

const TrendingVideoCard: React.FC<{ video: ITrendingVideo }> = ({ video }) => (
  <GlassCard className="flex flex-col gap-3 p-4">
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-medium text-foreground/90 line-clamp-3 flex-1">
        {video.title}
      </p>
      <a
        href={`https://youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch "${video.title}" on YouTube`}
        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <User className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{video.channelTitle}</span>
    </div>
  </GlassCard>
);

const TrendingSkeletonCard: React.FC = () => (
  <GlassCard className="flex flex-col gap-3 p-4">
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-3/4 rounded" />
    <Skeleton className="h-3 w-1/2 rounded" />
  </GlassCard>
);

export const TrendingTab: React.FC<TrendingTabProps> = ({ videos, isLoading, error }) => {
  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Loading trending videos">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TrendingSkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <TrendingUp className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <TrendingUp className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">No trending data available</p>
      </div>
    );
  }

  return (
    <section aria-label="Trending videos">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <TrendingVideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </section>
  );
};

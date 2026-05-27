import GlassCard from '@/components/shared/glassCard';
import { Skeleton } from '@/components/ui/skeleton';

export const TopicCardSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
    </GlassCard>
  );
};

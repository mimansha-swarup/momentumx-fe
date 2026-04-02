import GlassCard from "@/components/shared/glassCard";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-5">
      <div className="flex flex-col gap-3">
        <div className="flex-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="size-7 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <div className="flex-between gap-3 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </GlassCard>
  );
};

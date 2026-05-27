import { cn } from "@/lib/utils";
import { ListShimmerProps } from "@/types/components/title";
import { FC } from "react";
import GlassCard from "../shared/glassCard";

const ListShimmer: FC<ListShimmerProps> = ({ className, count = 3, showTitle = false }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && <div className="h-6 bg-white/10 rounded w-42 motion-safe:animate-pulse" />}
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard key={index} className="rounded-lg p-6">
          <div className="flex items-start justify-between motion-safe:animate-pulse">
            <div className="space-y-3 w-full">
              <div className="h-5 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-1/4"></div>
            </div>
            <div className="flex-shrink-0 h-10 w-24 bg-white/10 rounded"></div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default ListShimmer;

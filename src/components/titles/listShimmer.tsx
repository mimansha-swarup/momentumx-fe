import { cn } from "@/lib/utils";
import { ListShimmerProps } from "@/types/components/title";
import { FC } from "react";
import GlassCard from "../shared/glassCard";

const ListShimmer: FC<ListShimmerProps> = ({ className, count = 3 ,showTitle=false }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-42" />}
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard
          key={index}
          className="rounded-lg p-6 bg-white dark:bg-gray-800"
        >
          <div className="flex items-start justify-between animate-pulse">
            <div className="space-y-3 w-full">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="flex-shrink-0 h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default ListShimmer;

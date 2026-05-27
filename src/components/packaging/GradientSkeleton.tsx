import { cn } from "@/lib/utils";

interface GradientSkeletonProps {
  className?: string;
  lines?: number;
}

const GradientSkeleton = ({ className, lines = 3 }: GradientSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="relative h-4 overflow-hidden rounded-md bg-white/5"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default GradientSkeleton;

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
          className="relative h-4 overflow-hidden rounded-md bg-slate-800/50"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.15) 50%, transparent 100%)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default GradientSkeleton;

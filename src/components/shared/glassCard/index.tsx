import { cn } from "@/lib/utils";
import { IGlassCardProps } from "@/types/components/shared";
import { FC } from "react";

const GlassCard: FC<IGlassCardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white/5",
        "border border-white/10",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-white/20",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;

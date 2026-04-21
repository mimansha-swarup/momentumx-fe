import { cn } from "@/lib/utils";
import { IGlassCardProps } from "@/types/components/shared";
import { FC } from "react";

const GlassCard: FC<IGlassCardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-slate-900/90 to-slate-950/90",
        "border border-slate-700/50",
        "backdrop-blur-xl",
        "transition-all duration-300",
        "hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/50",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;

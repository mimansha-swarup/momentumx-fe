import { cn } from "@/lib/utils";
import { IGlassCardProps } from "@/types/components/shared";
import { FC } from "react";

const GlassCard: FC<IGlassCardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        ` border-[1px] border-accent shadow-sm dark:shadow-white/8   p-4 rounded-xl`,
        // ` border-[1px] border-accent bg-sidebar dark:shadow-white/8   p-4 rounded-xl`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;

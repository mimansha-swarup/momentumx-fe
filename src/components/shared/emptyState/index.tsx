import { FC } from "react";
import { cn } from "@/lib/utils";
import { FilePlus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description = "Start by adding a new item to get going.",
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "bg-white/5",
        "border border-white/10",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-white/20",
        "flex flex-col flex-center text-center px-4 py-12 rounded-xl",
        className,
      )}
    >
      <div className="icon-container size-14 mb-4">
        <FilePlus className="w-7 h-7" />
      </div>
      <h3 className="text-title text-lg">{title}</h3>
      <p className="text-label mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;

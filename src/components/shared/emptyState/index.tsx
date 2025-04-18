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
        "flex flex-col items-center justify-center text-center px-4 py-12 bg-muted/20 rounded-xl",
        className
      )}
    >
      <FilePlus className="w-10 h-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;

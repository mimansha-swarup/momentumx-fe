import { cn } from "@/lib/utils";
import { OverallStatus } from "@/types/feature/videoProject";

interface StatusFilterTabsProps {
  activeFilter: OverallStatus | "all";
  onChange: (filter: OverallStatus | "all") => void;
}

const FILTERS: { value: OverallStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "stale", label: "Needs Update" },
];

export const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
  activeFilter,
  onChange,
}) => {
  return (
    <nav aria-label="Filter projects by status" className="flex gap-2 flex-wrap">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          aria-pressed={activeFilter === value}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeFilter === value
              ? "bg-primary/20 text-primary border-primary/50"
              : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground",
          )}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

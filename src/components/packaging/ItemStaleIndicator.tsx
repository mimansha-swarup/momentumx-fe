import React from "react";
import { AlertTriangle } from "lucide-react";
import type { PackagingItemStatus } from "@/types/feature/packaging";

interface ItemStaleIndicatorProps {
  status: PackagingItemStatus;
}

export const ItemStaleIndicator: React.FC<ItemStaleIndicatorProps> = ({
  status,
}) => {
  if (status !== "stale") return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Outdated
    </span>
  );
};

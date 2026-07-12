import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/shared/glassCard';
import { cn } from '@/lib/utils';

interface HookCardProps {
  hookText: string;
  hookIndex: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  selectingIndex: number | null;
}

export const HookCard: React.FC<HookCardProps> = ({
  hookText,
  hookIndex,
  isSelected,
  onSelect,
  selectingIndex,
}) => {
  // A selection is in flight somewhere (disable all) vs THIS card is the one
  // being selected (spinner only here).
  const isSelecting = selectingIndex !== null;
  const isThisSelecting = selectingIndex === hookIndex;

  return (
    <GlassCard
      className={cn(
        'transition-all duration-200',
        isSelected && 'ring-2 ring-primary/60 border-primary/40',
      )}
    >
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Hook {hookIndex + 1}
        </span>

        <p className="text-sm text-foreground/90 leading-relaxed">{hookText}</p>

        <div className="flex items-center justify-end">
          {isSelected ? (
            <Button
              variant="ghost"
              size="sm"
              disabled
              aria-label={`Hook ${hookIndex + 1} selected`}
              className="text-emerald-400 hover:text-emerald-400 gap-1.5"
            >
              <Check className="h-4 w-4" />
              Selected
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => onSelect(hookIndex)}
              disabled={isSelecting}
              aria-label={`Select hook ${hookIndex + 1}`}
              className="gap-1.5"
            >
              {isThisSelecting && <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />}
              Select
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

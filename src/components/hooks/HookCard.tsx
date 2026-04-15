import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackButtons } from '@/components/research/FeedbackButtons';
import GlassCard from '@/components/shared/glassCard';
import { cn } from '@/lib/utils';
import type { FeedbackValue } from '@/types/feature/hooks';

interface HookCardProps {
  hookText: string;
  hookIndex: number;
  isSelected: boolean;
  feedback: FeedbackValue;
  onSelect: (index: number) => void;
  onFeedback: (index: number, feedback: FeedbackValue) => void;
  isSelecting: boolean;
  isSubmittingFeedback: boolean;
}

export const HookCard: React.FC<HookCardProps> = ({
  hookText,
  hookIndex,
  isSelected,
  feedback,
  onSelect,
  onFeedback,
  isSelecting,
  isSubmittingFeedback,
}) => {
  // Adapter: FeedbackButtons passes (topicId, fb) but we key by hookIndex
  const handleFeedback = (_topicId: string, fb: FeedbackValue) => {
    onFeedback(hookIndex, fb);
  };

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

        <div className="flex items-center justify-between">
          <FeedbackButtons
            topicId={String(hookIndex)}
            feedback={feedback}
            disabled={isSubmittingFeedback}
            onFeedback={handleFeedback}
          />

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
              {isSelecting && <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />}
              Select
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

import React from 'react';
import { HookCard } from './HookCard';
import type { FeedbackValue } from '@/types/feature/hooks';

interface HooksListProps {
  hooks: string[];
  batchId: string;
  selectedHookIndex: number | null;
  hookFeedback: Record<string, FeedbackValue>;
  onSelect: (index: number) => void;
  onFeedback: (index: number, feedback: FeedbackValue) => void;
  isSelecting: boolean;
  isSubmittingFeedback: boolean;
}

export const HooksList: React.FC<HooksListProps> = ({
  hooks,
  batchId,
  selectedHookIndex,
  hookFeedback,
  onSelect,
  onFeedback,
  isSelecting,
  isSubmittingFeedback,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hooks.map((hookText, index) => (
        <HookCard
          key={`${batchId}-${index}-${hookText.slice(0, 32)}`}
          hookText={hookText}
          hookIndex={index}
          isSelected={selectedHookIndex === index}
          feedback={hookFeedback[String(index)] ?? null}
          onSelect={onSelect}
          onFeedback={onFeedback}
          isSelecting={isSelecting}
          isSubmittingFeedback={isSubmittingFeedback}
        />
      ))}
    </div>
  );
};

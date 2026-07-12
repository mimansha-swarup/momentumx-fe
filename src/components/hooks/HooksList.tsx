import React from 'react';
import { HookCard } from './HookCard';

interface HooksListProps {
  hooks: string[];
  batchId: string;
  selectedHookIndex: number | null;
  onSelect: (index: number) => void;
  selectingIndex: number | null;
}

export const HooksList: React.FC<HooksListProps> = ({
  hooks,
  batchId,
  selectedHookIndex,
  onSelect,
  selectingIndex,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hooks.map((hookText, index) => (
        <HookCard
          key={`${batchId}-${index}-${hookText.slice(0, 32)}`}
          hookText={hookText}
          hookIndex={index}
          isSelected={selectedHookIndex === index}
          onSelect={onSelect}
          selectingIndex={selectingIndex}
        />
      ))}
    </div>
  );
};

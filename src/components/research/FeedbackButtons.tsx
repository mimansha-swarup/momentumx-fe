import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  topicId: string;
  feedback: 'like' | 'dislike' | null;
  disabled?: boolean;
  onFeedback: (topicId: string, feedback: 'like' | 'dislike' | null) => void;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  topicId,
  feedback,
  disabled = false,
  onFeedback,
}) => {
  const handleLike = () => {
    onFeedback(topicId, feedback === 'like' ? null : 'like');
  };

  const handleDislike = () => {
    onFeedback(topicId, feedback === 'dislike' ? null : 'dislike');
  };

  return (
    <div className={cn('flex flex-row gap-1', disabled && 'opacity-50')}>
      <button
        type="button"
        onClick={handleLike}
        disabled={disabled}
        aria-label="Like"
        aria-pressed={feedback === 'like'}
        className={cn(
          'rounded-lg p-1.5 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          feedback === 'like' ? 'text-emerald-400' : 'text-muted-foreground',
        )}
      >
        <ThumbsUp size={16} className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleDislike}
        disabled={disabled}
        aria-label="Dislike"
        aria-pressed={feedback === 'dislike'}
        className={cn(
          'rounded-lg p-1.5 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          feedback === 'dislike' ? 'text-red-400' : 'text-muted-foreground',
        )}
      >
        <ThumbsDown size={16} className="size-4" />
      </button>
    </div>
  );
};

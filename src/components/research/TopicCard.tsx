import { ArrowRight, FileText, Link2, Loader2, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/shared/glassCard';
import { cn } from '@/lib/utils';
import { IGeneratedTopic } from '@/types/components/dashboard';
import { FeedbackButtons } from './FeedbackButtons';

interface TopicCardProps {
  topic: IGeneratedTopic;
  isRegenerating: boolean;
  isCreating: boolean;
  onUseThisTopic: (topicId: string, videoProjectId: string | null) => void;
  onRegenerate: (topicId: string, hasProject: boolean) => void;
  onFeedback: (topicId: string, feedback: 'like' | 'dislike' | null) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isRegenerating,
  isCreating,
  onUseThisTopic,
  onRegenerate,
  onFeedback,
}) => {
  const hasProject = topic.videoProjectId !== null;

  const handleRegenerate = () => {
    onRegenerate(topic.id, hasProject);
  };

  const handleUseThisTopic = () => {
    onUseThisTopic(topic.id, topic.videoProjectId);
  };

  return (
    <GlassCard className="hover-scale-sm p-5">
      <p className="text-title text-sm line-clamp-3">{topic.title}</p>

      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {topic.isScriptGenerated && (
          <Badge variant="secondary" className="text-emerald-400">
            <FileText className="h-3 w-3" />
            Script done
          </Badge>
        )}
        {hasProject && (
          <Badge variant="secondary" className="text-blue-400">
            <Link2 className="h-3 w-3" />
            In project
          </Badge>
        )}
      </div>

      <div className="mt-3 flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-1">
          <FeedbackButtons
            topicId={topic.id}
            feedback={topic.userFeedback}
            disabled={isRegenerating}
            onFeedback={onFeedback}
          />
          <button
            type="button"
            aria-label="Regenerate topic"
            disabled={isRegenerating || isCreating}
            onClick={handleRegenerate}
            className={cn(
              'shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors duration-200',
              'hover:text-foreground hover:bg-white/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              'disabled:opacity-50',
            )}
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button
          size="sm"
          className="btn-primary-glow"
          onClick={handleUseThisTopic}
          disabled={isCreating || isRegenerating}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" />
              Creating...
            </>
          ) : hasProject ? (
            <>
              View Project
              <ArrowRight />
            </>
          ) : (
            <>
              Use Topic
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

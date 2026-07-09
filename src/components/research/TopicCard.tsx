import { ArrowRight, FileText, Link2, Loader2, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';
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
      <p className="text-title text-sm font-medium line-clamp-2">{topic.title}</p>

      {topic.concept && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {topic.concept}
        </p>
      )}

      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {topic.ideaType && (
          <Badge
            variant="secondary"
            className={topic.ideaType === 'short' ? 'text-fuchsia-400' : 'text-sky-400'}
          >
            <Sparkles className="h-3 w-3" />
            {topic.ideaType === 'short' ? 'Short' : 'Long-form'}
          </Badge>
        )}
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

      {topic.evidence && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground/80">
          <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/80" />
          <span className="line-clamp-2">{topic.evidence}</span>
        </p>
      )}

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

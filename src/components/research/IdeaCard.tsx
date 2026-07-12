import { ArrowRight, FileText, Link2, Loader2, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/shared/glassCard';
import { cn } from '@/lib/utils';
import { IGeneratedIdea } from '@/types/components/dashboard';

interface IdeaCardProps {
  idea: IGeneratedIdea;
  isRegenerating: boolean;
  isCreating: boolean;
  onUseThisIdea: (ideaId: string, videoProjectId: string | null) => void;
  onRegenerate: (ideaId: string, hasProject: boolean) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isRegenerating,
  isCreating,
  onUseThisIdea,
  onRegenerate,
}) => {
  const hasProject = idea.videoProjectId !== null;

  const handleRegenerate = () => {
    onRegenerate(idea.id, hasProject);
  };

  const handleUseThisIdea = () => {
    onUseThisIdea(idea.id, idea.videoProjectId);
  };

  return (
    <GlassCard className="hover-scale-sm p-5">
      <p className="text-title text-sm font-medium line-clamp-2">{idea.title}</p>

      {idea.concept && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {idea.concept}
        </p>
      )}

      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {idea.ideaType && (
          <Badge
            variant="secondary"
            className={idea.ideaType === 'short' ? 'text-fuchsia-400' : 'text-sky-400'}
          >
            <Sparkles className="h-3 w-3" />
            {idea.ideaType === 'short' ? 'Short' : 'Long-form'}
          </Badge>
        )}
        {idea.isScriptGenerated && (
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

      {idea.evidence && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground/80">
          <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/80" />
          <span className="line-clamp-2">{idea.evidence}</span>
        </p>
      )}

      <div className="mt-3 flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-1">
          <button
            type="button"
            aria-label="Regenerate idea"
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
          onClick={handleUseThisIdea}
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
              Use Idea
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

import { IGeneratedIdea } from "@/types/components/dashboard";
import { IdeaCard } from "./IdeaCard";
import { IdeaCardSkeleton } from "./IdeaCardSkeleton";

interface IdeaGridProps {
  ideas: IGeneratedIdea[];
  isLoading: boolean;
  regeneratingIdeaId: string | null;
  creatingForIdeaId: string | null;
  onUseThisIdea: (ideaId: string, videoProjectId: string | null) => void;
  onRegenerate: (ideaId: string, hasProject: boolean) => void;
}

export const IdeaGrid: React.FC<IdeaGridProps> = ({
  ideas,
  isLoading,
  regeneratingIdeaId,
  creatingForIdeaId,
  onUseThisIdea,
  onRegenerate,
}) => {
  if (isLoading && ideas.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <IdeaCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!isLoading && ideas.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          isRegenerating={regeneratingIdeaId === idea.id}
          isCreating={creatingForIdeaId === idea.id}
          onUseThisIdea={onUseThisIdea}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  );
};

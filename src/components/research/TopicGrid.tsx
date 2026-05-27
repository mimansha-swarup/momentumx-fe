import { IGeneratedTopic } from "@/types/components/dashboard";
import { TopicCard } from "./TopicCard";
import { TopicCardSkeleton } from "./TopicCardSkeleton";

interface TopicGridProps {
  topics: IGeneratedTopic[];
  isLoading: boolean;
  regeneratingTopicId: string | null;
  creatingForTopicId: string | null;
  onUseThisTopic: (topicId: string, videoProjectId: string | null) => void;
  onRegenerate: (topicId: string, hasProject: boolean) => void;
  onFeedback: (topicId: string, feedback: "like" | "dislike" | null) => void;
}

export const TopicGrid: React.FC<TopicGridProps> = ({
  topics,
  isLoading,
  regeneratingTopicId,
  creatingForTopicId,
  onUseThisTopic,
  onRegenerate,
  onFeedback,
}) => {
  if (isLoading && topics.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <TopicCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!isLoading && topics.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          isRegenerating={regeneratingTopicId === topic.id}
          isCreating={creatingForTopicId === topic.id}
          onUseThisTopic={onUseThisTopic}
          onRegenerate={onRegenerate}
          onFeedback={onFeedback}
        />
      ))}
    </div>
  );
};

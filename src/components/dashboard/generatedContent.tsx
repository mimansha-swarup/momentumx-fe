import { FC } from "react";
import GlassCard from "../shared/glassCard";
import { IGeneratedContentProps } from "@/types/components/dashboard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatToSimpleDate } from "@/utils/titles";
import EmptyState from "../shared/emptyState";
import ListShimmer from "../titles/listShimmer";
import { Sparkles, FileText } from "lucide-react";
import { Button } from "../ui/button";

const GeneratedContent: FC<IGeneratedContentProps> = ({
  heading,
  headingClassName = "",
  list,
  listRef,
  loading: contentLoading,
}) => {
  const navigate = useNavigate();

  const handleScriptGeneration = async (id: string, title: string) => {
    navigate(`/app/script/${id}?title=${encodeURIComponent(title)}#new`);
  };
  return (
    <div>
      <h2 className={cn("text-heading-lg", headingClassName)}>
        {heading}
      </h2>
      {list?.length === 0 ? (
        <EmptyState
          description="No generated content available"
          className="mt-4"
        />
      ) : (
        <div className="flex flex-col gap-4 mt-4" ref={listRef}>
          {contentLoading && <ListShimmer count={1} />}
          {list?.map((item) => (
            <GlassCard
              key={item.id}
              className="flex-between flex-wrap gap-4 card-accent-left"
              // style={{ animationDelay: `${index * 50}ms` }}
            >
              <div>
                <h3 className="text-title text-base">{item.title}</h3>
                <p className="text-caption">
                  created on: {formatToSimpleDate(item.createdAt)}
                </p>
              </div>
              <div className="ml-auto">
                {item?.isScriptGenerated ? (
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="btn-outline-hover"
                    onClick={() => navigate(`/app/script/${item.id}`)}
                  >
                    <FileText className="size-4" /> Show Script
                  </Button>
                ) : (
                  <Button
                    size={"sm"}
                    className="hover-scale bg-primary hover:bg-primary/90"
                    onClick={() => handleScriptGeneration(item.id, item.title)}
                  >
                    <Sparkles className="size-4" />
                    Generate
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneratedContent;

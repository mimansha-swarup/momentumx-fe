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
      <h2 className={cn("text-2xl font-semibold", headingClassName)}>
        {heading}
      </h2>
      {list?.length === 0 ? (
        <EmptyState
          description="No generated content available"
          className="mt-4"
        />
      ) : (
        // <p className="text-gray-500 text-sm">No generated content available</p>
        <div className="flex flex-col gap-4 mt-4" ref={listRef}>
          {contentLoading && <ListShimmer count={1} />}
          {list?.map((item) => (
            <GlassCard
              key={item.id}
              className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary"
            >
              <div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-gray-600 text-xs">
                  created on: {formatToSimpleDate(item.createdAt)}
                </p>
              </div>
              <div className="ml-auto">
                {item?.isScriptGenerated ? (
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="hover:scale-110 "
                    onClick={() => navigate(`/app/script/${item.id}`)}
                  >
                    <FileText /> Show Script
                  </Button>
                ) : (
                  <Button
                    size={"sm"}
                    className="hover:scale-110"
                    onClick={() => handleScriptGeneration(item.id, item.title)}
                  >
                    <Sparkles />
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

import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/shared/glassCard";
import { useAppSelector } from "@/hooks/useRedux";
import { FileText } from "lucide-react";
import EmptyState from "@/components/shared/emptyState";
import { rootScripts } from "@/utils/feature/scripts/script.slice";
import { useNavigate } from "react-router-dom";
import { stripMarkdown } from "@/utils/scripts";
import { Skeleton } from "@/components/ui/skeleton";

const ScriptPage = () => {
  const navigate = useNavigate();
  const { data: scripts, isLoading } = useAppSelector(rootScripts);

  return (
    <div className="md:w-[90%] mx-auto md:pt-4 pb-20">
      <Header title={"Script"} />
      {/* <div className="flex">
          <Button className="ml-auto" variant={"outline"}>
            <Download className="mr-2" />
            Download Script
          </Button>
        </div> */}

      {!scripts?.length && !isLoading && (
        <EmptyState
          description="No generated content available"
          className="mt-4"
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-rows-3">
        {isLoading
          ? [1, 2, 3, 4]?.map((e) => (
              <Skeleton
                key={e}
                className="h-40 w-full bg-accent-foreground/25"
              />
            ))
          : scripts?.map((item) => (
              <GlassCard
                key={item.id}
                className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 text-xs">
                    created on: {item.createdAt}
                  </p>
                  <p className="text-gray-600 line-clamp-4 mt-2">
                    {stripMarkdown(item.script || "")}
                  </p>
                </div>
                <div className="w-full px-6">
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="hover:scale-110  w-full"
                    onClick={() => navigate(`/app/script/${item.id}`)}
                  >
                    <FileText /> View{" "}
                  </Button>
                </div>
              </GlassCard>
            ))}
      </div>
    </div>
  );
};

export default ScriptPage;

import { FC } from "react";
import GlassCard from "../shared/glassCard";
// import { Button } from "../ui/button";
// import { FileText, Sparkles } from "lucide-react";
import { IGeneratedContentProps } from "@/types/components/dashboard";
import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
import { formatToSimpleDate } from "@/utils/titles";

const GeneratedContent: FC<IGeneratedContentProps> = ({
  heading,
  headingClassName = "",
  list,
}) => {
  // const navigate = useNavigate();
  return (
    <div>
      <h2 className={cn("text-2xl font-semibold", headingClassName)}>
        {heading}
      </h2>
      {list?.length === 0 ? (
        <p className="text-gray-500 text-sm">No generated content available</p>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
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
              {/* <div className="ml-auto">
                {true ? (
                  <Button size={"sm"} className="hover:scale-110">
                    <Sparkles />
                    Generate{" "}
                  </Button>
                ) : (
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="hover:scale-110 "
                    onClick={() => navigate(`/script/23543564`)}
                  >
                    <FileText /> Show Script
                  </Button>
                )}
              </div> */}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneratedContent;

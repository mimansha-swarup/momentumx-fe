import { Button } from "@/components/ui/button";
import { formatDateToWords } from "@/utils/titles";
import { FileText, Sparkles } from "lucide-react";
import GlassCard from "../glassCard";
import { useNavigate } from "react-router-dom";
import { FC } from "react";
import { IGeneratedTopic } from "@/types/components/dashboard";

const TitleCard: FC<IGeneratedTopic> = ({
  id,
  title,
  createdAt,
  isScriptGenerated,
}) => {
  const navigate = useNavigate();

  const handleScriptGeneration = async (id: string, title: string) => {
    navigate(`/app/script/${id}?title=${encodeURIComponent(title)}#new`);
  };
  return (
    <GlassCard
      key={id}
      className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary"
    >
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-gray-600 text-xs">
          created on: {formatDateToWords(createdAt)}
        </p>
      </div>
      <div className="ml-auto">
        {isScriptGenerated ? (
          <Button
            size={"sm"}
            variant={"outline"}
            className="hover:scale-110 "
            onClick={() => navigate(`/app/script/${id}`)}
          >
            <FileText /> Show Script
          </Button>
        ) : (
          <Button
            size={"sm"}
            className="hover:scale-110"
            onClick={() => handleScriptGeneration(id, title)}
          >
            <Sparkles /> Generate{" "}
          </Button>
        )}
      </div>
    </GlassCard>
  );
};

export default TitleCard;

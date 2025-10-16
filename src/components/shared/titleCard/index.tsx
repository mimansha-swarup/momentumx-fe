import { Button } from "@/components/ui/button";
import { formatDateToWords } from "@/utils/titles";
import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import GlassCard from "../glassCard";
import { useNavigate } from "react-router-dom";
import { FC, useState } from "react";
import { IGeneratedTopic } from "@/types/components/dashboard";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useRedux";
import { editTitles } from "@/utils/feature/titles/titles.thunk";

const TitleCard: FC<IGeneratedTopic> = ({
  id,
  title,
  createdAt,
  isScriptGenerated,
  updatedAt,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const dispatch = useAppDispatch();

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      setTitleText(title);
    }
  };
  const toggleLoading = () => {
    setIsLoading((prev) => !prev);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(e.target.value);
  };

  const onSave = async () => {
    try {
      toggleLoading();
      await dispatch(
        editTitles({
          titleId: id,
          id,
          title: titleText,
          createdAt: new Date(createdAt),
          isScriptGenerated,
          updatedAt: Date.now(),
        })
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      toggleLoading();
      toggleEditing();
    }
  };

  const handleScriptGeneration = async (id: string, title: string) => {
    navigate(`/app/script/${id}?title=${encodeURIComponent(title)}#new`);
  };
  return (
    <GlassCard
      key={id}
      className=" flex justify-between flex-wrap gap-4 items-center border-l- border-l--primary grouped"
    >
      {isEditing ? (
        <Input value={titleText} onChange={handleTextChange} />
      ) : (
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-gray-600 text-xs">
            {updatedAt
              ? `last updated on: ${formatDateToWords(updatedAt)}`
              : `created on: ${formatDateToWords(createdAt)}`}
          </p>
        </div>
      )}

      {isEditing ? (
        <div className="ml-auto flex gap-2">
          <Button size={"sm"} variant={"secondary"} onClick={toggleEditing}>
            Cancel
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      ) : (
        <div className="ml-auto flex gap-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            className="group-hover:scale-110 "
            onClick={toggleEditing}
          >
            Edit
          </Button>
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
      )}
    </GlassCard>
  );
};

export default TitleCard;

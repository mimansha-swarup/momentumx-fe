import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useRedux";
import { generateTitles } from "@/utils/feature/titles/titles.thunk";

const Greetings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div className="flex-between flex-wrap-reverse w-full gap-6 mb-10">
      <div>
        <h2 className="text-heading-xl mb-2">
          <span className="gradient-text">Welcome back!</span>
        </h2>
        <p className="text-label">Get AI generated topics that are not bookish</p>
      </div>

      <Button
        size={"lg"}
        className="rounded-full py-3 !px-6 ml-auto btn-primary-glow"
        onClick={() => {
          navigate("/app/title");
          dispatch(generateTitles());
        }}
      >
        <Plus className="size-5" /> Generate New Titles
      </Button>
    </div>
  );
};

export default Greetings;

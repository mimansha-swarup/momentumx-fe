import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useRedux";
import { generateTitles } from "@/utils/feature/titles/titles.thunk";

const Greetings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center flex-wrap-reverse justify-between w-full gap-6  mb-10">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Welcome back!</h2>
        <p>Get AI generated topics that are not bookish</p>
      </div>

      <Button
        size={"lg"}
        className="rounded-3xl py-3 !px-6 hover:scale-105 ml-auto"
        onClick={() => {
          navigate("/app/title");
          dispatch(generateTitles());
        }}
      >
        {" "}
        <Plus /> Generate New Titles
      </Button>
    </div>
  );
};

export default Greetings;

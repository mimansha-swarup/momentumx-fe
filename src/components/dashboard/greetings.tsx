import { Plus } from "lucide-react";
import { Button } from "../ui/button";

const Greetings = () => {
  return (
    <div className="flex items-center flex-wrap-reverse justify-between w-full gap-6  pt-18 mb-10">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Welcome back!</h2>
        <p>Get AI generated topics that are not bookish</p>
      </div>

      <Button
        size={"lg"}
        className="rounded-3xl py-3 !px-6 hover:scale-105 ml-auto"
      >
        {" "}
        <Plus /> Generate New Topics
      </Button>
    </div>
  );
};

export default Greetings;

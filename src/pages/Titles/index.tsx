import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import { AlertDestructive } from "@/components/titles/alertMessage";
import TitleList from "@/components/titles/list";
import ListShimmer from "@/components/titles/listShimmer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const TitlePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateTitles = async () => {
    setIsLoading((prev) => !prev);
  };
  return (
    <RootLayout>
      <div className="w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Titles"} />
        <div className="flex">
          <Button
            size={"lg"}
            className="rounded-3xl py-3 !px-6 hover:scale-105 ml-auto"
            onClick={generateTitles}
          >
            {" "}
            <Plus /> Generate New Titles
          </Button>
        </div>
        {!isLoading && <AlertDestructive />}

        {isLoading && <ListShimmer className="my-6" count={5} />}

        <TitleList />
      </div>
    </RootLayout>
  );
};

export default TitlePage;

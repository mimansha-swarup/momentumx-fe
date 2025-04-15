import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
// import { AlertDestructive } from "@/components/titles/alertMessage";
import TitleList from "@/components/titles/list";
import ListShimmer from "@/components/titles/listShimmer";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { rootTitle } from "@/utils/feature/titles/titles.slice";
import { generateTitles } from "@/utils/feature/titles/titles.thunk";
import { Plus } from "lucide-react";

const TitlePage = () => {
  const { isLoading: isTitleFetching } = useAppSelector(rootTitle);

  const dispatch = useAppDispatch();

  const generateTitle = async () => {
    dispatch(generateTitles());
  };
  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Titles"} />
        <div className="flex">
          <Button
            size={"lg"}
            className="rounded-3xl py-3 !px-6 hover:scale-105 ml-auto"
            onClick={generateTitle}
          >
            {" "}
            <Plus /> Generate New Titles
          </Button>
        </div>
        {/* {!isLoading && <AlertDestructive />} */}

        {isTitleFetching && <ListShimmer className="my-6" count={10} />}

        <TitleList />
      </div>
    </RootLayout>
  );
};

export default TitlePage;

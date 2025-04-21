import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import TitleList from "@/components/titles/list";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { titleService } from "@/service/titles";
import { resetState, titlesLoading } from "@/utils/feature/titles/titles.slice";
import { LoaderCircle, Plus } from "lucide-react";

const TitlePage = () => {
  const isTitleFetched = useAppSelector(titlesLoading);

  const dispatch = useAppDispatch();

  const generateTitle = async () => {
    dispatch(resetState()); // reset before starting
    titleService.startStreamingTitles(dispatch);
  };
  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={"Titles"} />
        <div className="flex">
          <Button
            size={"lg"}
            disabled={isTitleFetched}
            className="rounded-3xl py-3 !px-6 hover:scale-105 ml-auto"
            onClick={generateTitle}
          >
            {" "}
            {isTitleFetched ? (
              <LoaderCircle className="animate-spin " />
            ) : (
              <Plus />
            )}
            Generate New Titles
          </Button>
        </div>

        <TitleList />
      </div>
    </RootLayout>
  );
};

export default TitlePage;

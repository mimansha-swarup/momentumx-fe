import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import TitleList from "@/components/titles/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="md:w-[90%] overflow-hidden mx-auto pt-4 pb-20 relative">
        <Header title={"Titles"} />
        <div className="sticky top-0 left-0 right-0">
          <div className="flex justify-between mb-4 flex-wrap-reverse gap-2">
            <Input
              type="search"
              placeholder="Search Titles..."
              className="mr-auto w-full align-middle sm:max-w-80"
            />
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
          <div className="flex items-center mb-6 gap-4">
            <Button>All</Button>
            <Button variant={"outline"}>Generated</Button>
          </div>
        </div>

        <TitleList />
      </div>
    </RootLayout>
  );
};

export default TitlePage;

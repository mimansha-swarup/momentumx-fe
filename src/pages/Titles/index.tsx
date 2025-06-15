import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import TitleList from "@/components/titles/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import useTitles from "@/hooks/useTitles";
import {
  resetTitle,
  rootTitle,
  updateFilter,
} from "@/utils/feature/titles/titles.slice";
import { generateTitles } from "@/utils/feature/titles/titles.thunk";
import { LoaderCircle, Plus } from "lucide-react";

const filters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Generated",
    value: "generated",
  },
];
const TitlePage = () => {
  const {
    params: { searchText, filter: filterBy },
    isDone: isTitleFetched,
  } = useAppSelector(rootTitle);
  const dispatch = useAppDispatch();
  const [fetchTitles] = useTitles();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFilter({ searchText: e.target.value }));
  };

  const onFiltersChange = (value: string) => () => {
    if (filterBy === value) return;
    dispatch(updateFilter({ filter: value }));
    dispatch(resetTitle());
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchTitles({ isFresh: true });
    }
  };

  const generateTitle = async () => {
    if (filterBy === "generated") {
      dispatch(resetTitle());
      dispatch(updateFilter({ filter: "all" }));
    }
    dispatch(generateTitles());
  };
  return (
    <RootLayout>
      <div className="md:w-[90%]  mx-auto pt-4 relative">
        <Header title={"Titles"} />
        <div className="-mt-6">
          <div className="flex justify-between mb-4 flex-wrap-reverse gap-2">
            <Input
              type="search"
              placeholder="Search Titles..."
              className="mr-auto w-full align-middle sm:max-w-80"
              onChange={handleSearch}
              value={searchText}
              onKeyDown={onEnter}
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
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={filterBy === filter.value ? "default" : "outline"}
                onClick={onFiltersChange(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <TitleList fetchList={fetchTitles} />
      </div>
    </RootLayout>
  );
};

export default TitlePage;

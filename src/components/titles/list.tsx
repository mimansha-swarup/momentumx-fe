import { useMemo } from "react";
import GeneratedContent from "../dashboard/generatedContent";
import { useAppSelector } from "@/hooks/useRedux";
import { getTitlesData } from "@/utils/feature/titles/titles.slice";
import { groupTitles } from "@/utils/titles";
import EmptyState from "../shared/emptyState";

const TitleList = () => {
  const titles = useAppSelector(getTitlesData);

  const groupedTitles = useMemo(() => {
    return titles ? groupTitles(titles) : {};
  }, [titles]);

  const groupedTitlesKey = Object?.keys(groupedTitles);
  return (
    <div>
      <div className="flex flex-col gap-8">
        {!groupedTitlesKey.length ? (
          <EmptyState
            description="No generated content available"
            className="mt-4"
          />
        ) : (
          groupedTitlesKey?.map((date) => (
            <GeneratedContent
              key={date}
              heading={date}
              list={groupedTitles[date]}
              headingClassName="text-lg font-medium text-gray-600 dark:text-gray-300"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TitleList;

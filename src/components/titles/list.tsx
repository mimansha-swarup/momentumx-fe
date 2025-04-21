import { useEffect, useMemo, useRef } from "react";
import GeneratedContent from "../dashboard/generatedContent";
import { useAppSelector } from "@/hooks/useRedux";
import {
  getTitlesData,
  titlesLoading,
} from "@/utils/feature/titles/titles.slice";
import { groupTitles } from "@/utils/titles";
import EmptyState from "../shared/emptyState";

const TitleList = () => {
  const titles = useAppSelector(getTitlesData);
  const isTitleFetched = useAppSelector(titlesLoading);
  const scrollToRef = useRef<HTMLDivElement | null>(null);

  const groupedTitles = useMemo(() => {
    return titles ? groupTitles(titles) : {};
  }, [titles]);

  useEffect(() => {
    if (scrollToRef?.current && isTitleFetched) {
      (scrollToRef?.current?.childNodes
        ?.item(0) as HTMLDivElement)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [groupedTitles, isTitleFetched]);

  const groupedTitlesKey = Object?.keys(groupedTitles)?.reverse();
  return (
    <div>
      <div className="flex flex-col gap-8">
        {!groupedTitlesKey.length ? (
          <EmptyState
            description="No generated content available"
            className="mt-4"
          />
        ) : (
          groupedTitlesKey?.map((date, index) => (
            <GeneratedContent
              key={date}
              heading={date}
              list={groupedTitles[date]}
              headingClassName="text-lg font-medium text-gray-600 dark:text-gray-300"
              {...(index === 0 && groupedTitles[date]?.length % 10 !== 0
                ? { listRef: scrollToRef, loading: isTitleFetched }
                : {})}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TitleList;

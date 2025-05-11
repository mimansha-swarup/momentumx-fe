import { useEffect, useMemo, useRef } from "react";
import GeneratedContent from "../dashboard/generatedContent";
// TODO: check and Fix
import { useAppSelector } from "@/hooks/useRedux";
import {
  getTitlesData,
  titlesLoading,
} from "@/utils/feature/titles/titles.slice";
import EmptyState from "../shared/emptyState";
import TitleCard from "../shared/titleCard";

const TitleList = () => {
  const { lists = [] } = useAppSelector(getTitlesData) || {};
  const isTitleFetched = useAppSelector(titlesLoading);
  const scrollToRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (scrollToRef?.current && isTitleFetched) {
  //     (
  //       scrollToRef?.current?.childNodes?.item(0) as HTMLDivElement
  //     )?.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, [groupedTitles, isTitleFetched]);

  return (
    <div className="overflow-y-auto h-full relative">
      <div className="flex flex-col gap-8">
        {!lists.length ? (
          <EmptyState
            description="No generated content available"
            className="mt-4"
          />
        ) : (
          lists?.map((titleRecord) => (
            <TitleCard key={titleRecord.id} {...titleRecord} />
          ))
        )}
      </div>
    </div>
  );
};

export default TitleList;

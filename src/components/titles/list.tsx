import { useCallback, useEffect, useRef, useState } from "react";

// TODO: check and Fix
import { useAppSelector } from "@/hooks/useRedux";
import { rootTitle } from "@/utils/feature/titles/titles.slice";
import EmptyState from "../shared/emptyState";
import TitleCard from "../shared/titleCard";
import ListShimmer from "./listShimmer";

const TitleList = ({
  fetchList,
}: {
  fetchList: ({ isFresh }: { isFresh?: boolean | undefined }) => Promise<void>;
}) => {
  const {
    data: titleData,
    params: { searchText, filter },
    isLoading: isTitleFetched,
    isDone: isTitleDone,
  } = useAppSelector(rootTitle);
  const { lists = [], meta } = titleData || {};
  const listRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (!listRef.current) return;
    const scrolled = listRef.current.scrollTop > 0;
    setIsScrolled(scrolled);
  };

  useEffect(() => {
    listRef?.current?.addEventListener("scroll", handleScroll);

    return () => {
      listRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleObserver: IntersectionObserverCallback = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isTitleFetched) {
        fetchList({ isFresh: false });
      }
    },
    [meta, filter, searchText]
  );

  useEffect(() => {
    const option = {
      root: listRef?.current,
      rootMargin: "100px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (lists.length && meta?.hasNextPage && loaderRef?.current) {
      observer.observe(loaderRef?.current);
    }

    return () => {
      if (loaderRef?.current) {
        observer.unobserve(loaderRef?.current);
      }
    };
  }, [lists.length, meta?.hasNextPage, handleObserver]);

  useEffect(() => {
    if (isTitleDone) {
      const generatingTitles = document.getElementById("generating-titles");
      if (generatingTitles) {
        generatingTitles.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isTitleDone]);

  return (
    <div
      className={` overflow-y-auto -mx-5 flex flex-col gap-8 h-[calc(100vh-228px)] pb-4 px-2 ${isScrolled ? "shadow-[inset_0_8px_8px_-4px_rgba(0,0,0,0.1)]" : ""}`}
      ref={listRef}
    >
      {(isTitleDone || isTitleFetched) && (
        <div id="generating-titles">
          <ListShimmer count={5} />
        </div>
      )}
      {!lists.length && !isTitleFetched ? (
        <EmptyState
          description="No generated content available"
          className="mt-4"
        />
      ) : (
        lists?.map((titleRecord) => (
          <TitleCard key={titleRecord.id} {...titleRecord} />
        ))
      )}

      {lists.length > 0 && meta?.hasNextPage && (
        <div ref={loaderRef}>
          <ListShimmer count={3} />
        </div>
      )}
    </div>
  );
};

export default TitleList;

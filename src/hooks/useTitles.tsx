import { resetTitle, selectTitlesRoot } from "@/utils/feature/titles/titles.slice";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";

const useTitles = () => {
  
  const dispatch = useAppDispatch();
  const { data, params:{searchText, filter:filterBy} } = useAppSelector(selectTitlesRoot);
  const { meta, lists } = data || {};

  const isFirstRun = useRef(true);

  const fetchTitle = useCallback(async ({ isFresh = false }) => {
    let params: {
      searchText?: string;
      isScriptGenerated?: string;
      isFresh: boolean;
      createdAt?: string;
      docId?: string;
    } = {
      isFresh,
    };
    if (searchText) {
      params.searchText = searchText;
      dispatch(resetTitle());
    }

    if (filterBy === "generated") {
      params.isScriptGenerated = "true";
    }
    if (!isFresh && meta && meta?.hasNextPage) {
      params = {
        ...params,
        ...meta?.nextCursor,
      };
    }
    dispatch(retrieveTitles(params));
  },[searchText, filterBy, meta, dispatch]
)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (!lists || lists.length === 0) {
        fetchTitle({ isFresh: true });
      }
      return;
    }

    fetchTitle({ isFresh: true });
    // Intentional: lists.length excluded — only re-fetch on filter/search change, not after fetch completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy, searchText, fetchTitle]);

  return [fetchTitle];
};

export default useTitles;

import { resetTitle, rootTitle } from "@/utils/feature/titles/titles.slice";
import { retrieveTitles } from "@/utils/feature/titles/titles.thunk";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";

const useTitles = () => {
  
  const dispatch = useAppDispatch();
  const { data, params:{searchText, filter:filterBy} } = useAppSelector(rootTitle);
  const { meta, lists } = data || {};

  const isFirstRun = useRef(true);

  useEffect(()=>{
  },[filterBy])
  const fetchTitle =useCallback( async ({ isFresh = false }) => {
    let params: {
      searchText?: string;
      isScriptGenerated?: boolean;
      isFresh: boolean;
    } = {
      isFresh,
    };
    if (searchText) {
      params.searchText = searchText;
      dispatch(resetTitle());
    }
    
    if (filterBy === "generated") {
      params.isScriptGenerated = true;
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
      if (lists?.length === 0) {
        fetchTitle({ isFresh: true });
      }
      return;
    }

    fetchTitle({ isFresh: true });
  }, [filterBy, searchText]);

  return [fetchTitle];
};

export default useTitles;

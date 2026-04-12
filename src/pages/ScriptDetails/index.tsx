import MyEditor from "@/components/shared/Editor";
import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// SSE streaming via EventSource cannot use baseFetch (no custom headers) —
// direct service call here is the intentional exception for legacy SSE flow.
import { scriptService } from "@/service/script";
import {
  clearCurrentScript,
  markDone,
  resetState,
  selectCurrentScript,
  selectScripts,
} from "@/utils/feature/scripts/script.slice";
import {
  editScript,
  getScriptById,
  retrieveScripts,
} from "@/utils/feature/scripts/script.thunk";
import {
  getTitlesData,
  markScriptGenerated,
} from "@/utils/feature/titles/titles.slice";
import { htmlToMarkdown } from "@/utils/markdown";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { SCRIPT_GENERATION_DELAY_MS } from "@/constants/app";

const ScriptDetails = () => {
  const { scriptId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const navigate = useNavigate();

  const { lists: titleLists = [] } = useAppSelector(getTitlesData) || {};
  const {
    isDone,
    data: scriptRecord = [],
    isLoading,
  } = useAppSelector(selectScripts);
  const currentScript = useAppSelector(selectCurrentScript);
  const dispatch = useAppDispatch();
  const [script, setScript] = useState("");
  const [title, setTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const titleFromUrl = decodeURIComponent(searchParams.get("title") || "");

  const titleRecord = titleLists?.find((t) => t.id === scriptId);

  // Sync title from Redux record or URL param
  useEffect(() => {
    setTitle(titleRecord?.title || titleFromUrl);
  }, [titleRecord, titleFromUrl]);

  // Suppress context menu (copy protection)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.body.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const updateScript = (newScript: string) => {
    setScript((prev) => prev + newScript);
    divRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (!hash) {
      const scriptObject = scriptRecord?.find((s) => s.id === scriptId);
      if (scriptObject) {
        setScript(scriptObject.script);
        setTitle(scriptObject?.title);
      } else {
        // C1: dispatch thunk instead of calling service directly
        dispatch(getScriptById(scriptId));
      }
    } else {
      // Legacy flow: mark topic as script-generated in titles slice
      dispatch(markScriptGenerated(scriptId));
      dispatch(resetState());

      const onDone = () => {
        dispatch(markDone());
        // C5: store timeout ref so it can be cleared on unmount
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          navigate(`/app/script/${scriptId}`);
          dispatch(retrieveScripts());
        }, SCRIPT_GENERATION_DELAY_MS);
      };

      // C2: store EventSource in ref for cleanup
      const startStream = async () => {
        const evtSource = await scriptService.startStreamingScripts(
          scriptId,
          updateScript,
          onDone,
          () => {
            // Legacy page — stream error handled silently
          }
        );
        eventSourceRef.current = evtSource;
      };

      startStream();
    }

    return () => {
      // C2 + C5: close EventSource and clear timeout on cleanup
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId, hash, dispatch, navigate]);

  // Sync script content when getScriptById thunk resolves into Redux state
  useEffect(() => {
    if (currentScript && currentScript.id === scriptId) {
      setScript(currentScript.script);
      setTitle(currentScript.title);
    }
  }, [currentScript, scriptId]);

  // Cleanup currentScript on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      dispatch(clearCurrentScript());
    };
  }, [dispatch]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const toggleUpdatingMode = () => {
    setIsUpdating((prev) => !prev);
  };

  const onSave = async (scriptContent: string) => {
    try {
      toggleUpdatingMode();
      await dispatch(
        editScript({
          scriptId,
          script: htmlToMarkdown(scriptContent),
        })
      );
    } catch {
      // Error handled silently
    } finally {
      toggleUpdatingMode();
      toggleEditMode();
    }
  };

  return (
    <div className="md:w-[90%] mx-auto pt-4 pb-20">
      <Header title={`Script - ${title}`} showBack />

      {!isEditMode && (
        <div className="flex mb-2 justify-end">
          <Button onClick={toggleEditMode}>
            <Pencil /> Edit
          </Button>
        </div>
      )}
      {isEditMode ? (
        <MyEditor
          toEditText={script}
          onSave={onSave}
          onCancel={toggleEditMode}
          loading={isUpdating}
        />
      ) : (
        <GlassCard>
          <div ref={divRef} className="unselectable">
            {(!isDone || isLoading) && !script ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="w-25 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-55 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-35 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-45 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-55 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-25 h-3 bg-accent-foreground/25" />
                <Skeleton className="w-35 h-3 bg-accent-foreground/25" />
              </div>
            ) : (
              <MarkdownPreview content={script} />
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ScriptDetails;

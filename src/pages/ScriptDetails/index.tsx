import MyEditor from "@/components/shared/Editor";
import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import RootLayout from "@/components/shared/rootLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { scriptService } from "@/service/script";
import {
  markDone,
  resetState,
  rootScripts,
} from "@/utils/feature/scripts/script.slice";
import {
  editScript,
  retrieveScripts,
} from "@/utils/feature/scripts/script.thunk";
import {
  getTitlesData,
  markScriptGenerated,
} from "@/utils/feature/titles/titles.slice";
import { htmlToMarkdown } from "@/utils/markdown";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

const ScriptDetails = () => {
  const { scriptId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const { lists: titleLists = [] } = useAppSelector(getTitlesData) || {};
  const {
    isDone,
    data: scriptRecord = [],
    isLoading,
  } = useAppSelector(rootScripts);
  const dispatch = useAppDispatch();
  const [script, setScript] = useState("");
  const [title, setTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  const titleFromUrl = decodeURIComponent(searchParams.get("title") || "");

  const titleRecord = titleLists?.find((title) => title.id === scriptId);
  useEffect(() => {
    setTitle(titleRecord?.title || titleFromUrl);
  }, [titleRecord || titleFromUrl]);

  const updateScript = (newScript: string) => {
    setScript((prev) => prev + newScript);
    divRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.body.addEventListener("contextmenu", handleContextMenu);
    // edit logic and create a get if record is not present then fetch it TODO:
    if (!hash) {
      const scriptObject = scriptRecord?.find(
        (script) => script.id === scriptId
      );
      if (scriptObject) {
        setScript(scriptObject.script);
        setTitle(scriptObject?.title);
      } else {
        scriptService.getScriptById(scriptId).then(({ data }) => {
          setScript(data.script);
        });
      }
    } else {
      dispatch(markScriptGenerated(scriptId));
      dispatch(resetState());
      const onDone = () => {
        dispatch(markDone());
        setTimeout(() => dispatch(retrieveScripts()), 5000);
      };
      scriptService.startStreamingScripts(scriptId, updateScript, onDone);
    }

    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [scriptId]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const toggleUpdatingMode = () => {
    setIsUpdating((prev) => !prev);
  };

  const onSave = (scriptContent: string) => {
    try {
      toggleUpdatingMode();
      dispatch(editScript({ scriptId, script: htmlToMarkdown(scriptContent), updatedAt: Date.now() }));
    } catch (error) {
      console.log("Error :", error);
    } finally {
      toggleUpdatingMode();
      toggleEditMode();
    }
  };

  return (
    <RootLayout>
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
    </RootLayout>
  );
};

export default ScriptDetails;

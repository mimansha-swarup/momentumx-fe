import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import RootLayout from "@/components/shared/rootLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { scriptService } from "@/service/script";
import { getScriptsData } from "@/utils/feature/scripts/script.slice";
import { retrieveScripts } from "@/utils/feature/scripts/script.thunk";
import {
  getTitlesData,
  markScriptGenerated,
} from "@/utils/feature/titles/titles.slice";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
// import React from "react";

const ScriptDetails = () => {
  const { scriptId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const { lists: titleLists = [] } = useAppSelector(getTitlesData) || {};
  const scriptRecord = useAppSelector(getScriptsData) || [];
  const dispatch = useAppDispatch();
  const [script, setScript] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();
  const titleFromUrl = decodeURIComponent(searchParams.get("title") || "");

  const titleRecord = titleLists?.find((title) => title.id === scriptId);
  const title = titleRecord?.title;

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
      const scriptObject = scriptRecord.find(
        (script) => script.id === scriptId
      );
      if (scriptObject ) {
        setScript(scriptObject.script);
      } else {
        scriptService.getScriptById(scriptId).then(({ data }) => {
          setScript(data.script);
        });
      }
    } else {
      dispatch(markScriptGenerated(scriptId));
      const onDone = () => {
        dispatch(retrieveScripts());
      };
      scriptService.startStreamingScripts(scriptId, updateScript, onDone);
    }

    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [scriptId]);
  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={`Script - ${title || titleFromUrl}`} />

        <GlassCard>
          <div ref={divRef} className="unselectable">
            <MarkdownPreview content={script} />
          </div>
        </GlassCard>
      </div>
    </RootLayout>
  );
};

export default ScriptDetails;

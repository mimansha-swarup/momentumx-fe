import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import { MarkdownPreview } from "@/components/shared/MarkdownRenderer";
import RootLayout from "@/components/shared/rootLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { scriptService } from "@/service/script";
import { getScriptsData } from "@/utils/feature/scripts/script.slice";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// import React from "react";

const ScriptDetails = () => {
  const { scriptId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const scripts = useAppSelector(getScriptsData);
  const dispatch = useAppDispatch();
  const [script, setScript] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  const scriptRecord = scripts?.find((script) => script.id === scriptId);
  const title = decodeURIComponent(searchParams.get("title") || "");

  const updateScript = (newScript: string) => {
    setScript((prev) => prev + newScript);
    divRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  useEffect(() => {
    if (!scriptRecord) {
      // dispatch(retrieveScripts());
      scriptService.startStreamingScripts(scriptId, updateScript, dispatch);
    } else {
      setScript(scriptRecord.script);
    }
  }, [scriptId]);
  return (
    <RootLayout>
      <div className="md:w-[90%] mx-auto pt-4 pb-20">
        <Header title={`Script - ${scriptRecord?.title || title}`} />

        <GlassCard>
          <div ref={divRef}>
            <MarkdownPreview content={script} />
          </div>
        </GlassCard>
      </div>
    </RootLayout>
  );
};

export default ScriptDetails;

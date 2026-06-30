import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { scriptService } from "@/service/script";
import { markDone, resetState } from "@/utils/feature/scripts/script.slice";
import {
  getProject,
  startStep,
} from "@/utils/feature/videoProject/videoProject.thunk";
import { SCRIPT_GENERATION_DELAY_MS } from "@/constants/app";

interface UseScriptStreamOptions {
  projectId: string;
}

interface UseScriptStreamReturn {
  streamContent: string;
  isStreaming: boolean;
  streamError: boolean;
  startStreaming: () => void;
  scrollSentinelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Encapsulates SSE script streaming lifecycle.
 *
 * SSE via EventSource cannot use baseFetch (no custom headers), so this hook
 * calls scriptService.startStreamingScripts directly — the only intentional
 * exception to the Service → Thunk → Slice → Component data flow.
 * Token is fetched manually via auth.currentUser?.getIdToken() inside the service.
 */
export const useScriptStream = ({
  projectId,
}: UseScriptStreamOptions): UseScriptStreamReturn => {
  const dispatch = useAppDispatch();

  const [streamContent, setStreamContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const scrollSentinelRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStreamingRef = useRef(false);
  const mountedRef = useRef(true);

  const startStreaming = useCallback(() => {
    if (!projectId) return;

    // Guard against duplicate streams
    if (isStreamingRef.current) return;
    isStreamingRef.current = true;

    setIsStreaming(true);
    setStreamContent("");
    setStreamError(false);
    dispatch(resetState());

    const onError = () => {
      if (!mountedRef.current) return;
      setStreamError(true);
      setIsStreaming(false);
      isStreamingRef.current = false;
    };

    const initStream = async () => {
      // Dispatch startStep to mark pipeline as in_progress before streaming
      const stepResult = await dispatch(startStep({ projectId, stepName: "script" }));
      if (startStep.rejected.match(stepResult)) {
        onError();
        return;
      }

      const onChunk = (chunk: string) => {
        if (!mountedRef.current) return;
        setStreamContent((prev) => prev + chunk);
        scrollSentinelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      };

      const onDone = () => {
        if (!mountedRef.current) return;
        dispatch(markDone());
        // Backend auto-started, auto-linked, auto-completed the script step.
        // Re-fetch the project to pick up the newly-set scriptId; the page then
        // loads the script once project.scriptId is available.
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          dispatch(getProject(projectId));
          setIsStreaming(false);
          isStreamingRef.current = false;
        }, SCRIPT_GENERATION_DELAY_MS);
      };

      try {
        const evtSource = await scriptService.startStreamingScripts(
          projectId,
          onChunk,
          onDone,
          onError
        );
        eventSourceRef.current = evtSource;
      } catch {
        onError();
      }
    };

    initStream();
  }, [projectId, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isStreamingRef.current = false;
    };
  }, []);

  return {
    streamContent,
    isStreaming,
    streamError,
    startStreaming,
    scrollSentinelRef,
  };
};

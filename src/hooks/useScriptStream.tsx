import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { scriptService } from "@/service/script";
import { markDone, resetState } from "@/utils/feature/scripts/script.slice";
import { getProject } from "@/utils/feature/videoProject/videoProject.thunk";
import {
  SCRIPT_SAVE_POLL_INTERVAL_MS,
  SCRIPT_SAVE_POLL_MAX_ATTEMPTS,
} from "@/constants/app";

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
  const contentRef = useRef("");
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
    contentRef.current = "";
    setStreamError(false);
    dispatch(resetState());

    const onError = () => {
      if (!mountedRef.current) return;
      setStreamError(true);
      setIsStreaming(false);
      isStreamingRef.current = false;
    };

    const initStream = async () => {
      // No startStep here: the stream endpoint owns the in_progress transition
      // server-side, and uses it as an in-flight lock — a client-side PATCH
      // first would trip that lock and 409 the stream it precedes.

      const onChunk = (chunk: string) => {
        if (!mountedRef.current) return;
        contentRef.current += chunk;
        setStreamContent((prev) => prev + chunk);
        scrollSentinelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      };

      const onDone = () => {
        if (!mountedRef.current) return;
        // [DONE] with zero content = the server terminated a failed generation
        // (e.g. Gemini timeout). Surface it as an error so the page offers retry
        // instead of idling on a blank state.
        if (!contentRef.current) {
          onError();
          return;
        }
        dispatch(markDone());
        // The server persists the script AFTER [DONE], so poll the project
        // until scriptId lands instead of guessing with a fixed delay — a slow
        // or failed save used to strand the page on "Finalizing…" forever.
        // isStreaming drops now so the page shows the finalizing state.
        setIsStreaming(false);
        isStreamingRef.current = false;
        const poll = async (attempt: number) => {
          if (!mountedRef.current) return;
          const res = await dispatch(getProject(projectId));
          if (!mountedRef.current) return;
          if (getProject.fulfilled.match(res) && res.payload?.scriptId) return;
          if (attempt >= SCRIPT_SAVE_POLL_MAX_ATTEMPTS) {
            // Save never landed — surface the retry state, not a spinner.
            setStreamError(true);
            return;
          }
          timeoutRef.current = setTimeout(
            () => poll(attempt + 1),
            SCRIPT_SAVE_POLL_INTERVAL_MS
          );
        };
        poll(0);
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

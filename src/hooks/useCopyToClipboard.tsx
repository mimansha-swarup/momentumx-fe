import { useCallback, useState } from "react";
import { toastSuccess, toastError } from "@/utils/toast";

// Copies text to the clipboard and flips `copied` true for 2s (drives the
// copy → check icon swap in the packaging cards). Success/failure toasts are
// handled here; callers pass only the text and an optional success message.
export function useCopyToClipboard(successMessage = "Copied to clipboard") {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toastSuccess(successMessage);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toastError("Failed to copy");
      }
    },
    [successMessage]
  );

  return [copied, copy] as const;
}

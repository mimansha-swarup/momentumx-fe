import { marked } from "marked";
import DOMPurify from "dompurify";
import TurndownService from "turndown";

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  const rawHtml = marked.parse(markdown, { breaks: true });
  return DOMPurify.sanitize(
    typeof rawHtml === "string" ? rawHtml : String(rawHtml)
  );
}

export function htmlToMarkdown(html: string): string {
  if (!html) return "";
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  return turndown.turndown(html);
}

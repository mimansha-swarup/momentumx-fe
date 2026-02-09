import { MARKDOWN_PREVIEW_LIMIT } from "@/constants/app";

// Simple Markdown to plain preview (strips Markdown syntax)
export const stripMarkdown = (text: string) => {
  return text.slice(0, MARKDOWN_PREVIEW_LIMIT).replace(/[_*#>`-]/g, "") + "...";
};

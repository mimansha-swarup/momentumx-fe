import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreak from "remark-breaks";

// Hoisted: this closes over nothing, and MarkdownPreview renders on the SSE hot
// path (script streaming), so a fresh object per render would remount every
// custom element renderer on every chunk.
const COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="unselectable">{children}</h1>,
  h2: ({ children }) => <h2 className="unselectable">{children}</h2>,
  p: ({ children }) => (
    <p className=" leading-6 my-3 text-base unselectable">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold unselectable ">{children}</strong>
  ),
  em: ({ children }) => <em className="italic unselectable">{children}</em>,
};

const REMARK_PLUGINS = [remarkGfm, remarkBreak];

export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS}>
      {content}
    </ReactMarkdown>
  );
};

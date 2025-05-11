import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreak from "remark-breaks";

export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      children={content}
      // className="prose prose-invert max-w-none dark:prose-invert"
      remarkPlugins={[remarkGfm, remarkBreak]}
      components={{
        h1: ({ children }) => <h1 className="unselectable">{children}</h1>, // skip headers in preview
        h2: ({ children }) => <h2 className="unselectable">{children}</h2>,
        p: ({ children }) => (
          <p className=" leading-6 my-3 text-base unselectable">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold unselectable ">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic unselectable">{children}</em>
        ),
      }}
    />
  );
};

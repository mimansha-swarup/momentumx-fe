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
        h1: ({ children }) => <h1>{children}</h1>, // skip headers in preview
        h2: ({ children }) => <h2>{children}</h2>,
        p: ({ children }) => <p className=" leading-5 my-3">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    />
  );
};

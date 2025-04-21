// Simple Markdown to plain preview (you can also strip Markdown syntax)
export const stripMarkdown = (text: string) => {
  return text.slice(0, 300).replace(/[_*#>`-]/g, "") + "...";
};

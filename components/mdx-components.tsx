import type { MDXComponents } from "mdx/types";

interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "warning" | "error" | "success";
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950 border-blue-500",
    warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-500",
    error: "bg-red-50 dark:bg-red-950 border-red-500",
    success: "bg-green-50 dark:bg-green-950 border-green-500",
  };

  return (
    <div className={`border-l-4 p-4 my-4 ${styles[type]}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
}

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {tags.map((tag) => (
        <span key={tag} className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded text-sm">
          {tag}
        </span>
      ))}
    </div>
  );
}

interface MediaEmbedProps {
  src: string;
  type: "video" | "image";
  caption?: string;
}

export function MediaEmbed({ src, type, caption }: MediaEmbedProps) {
  return (
    <figure className="my-6">
      {type === "video" ? (
        <video src={src} controls className="w-full">
          <track kind="captions" />
        </video>
      ) : (
        <img src={src} alt={caption || ""} className="w-full" />
      )}
      {caption && (
        <figcaption className="text-sm text-black/60 dark:text-white/60 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface PromptBlockProps {
  children: React.ReactNode;
}

export function PromptBlock({ children }: PromptBlockProps) {
  return (
    <div className="my-6 p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded">
      <div className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40 mb-2">
        Prompt
      </div>
      <div className="font-mono text-sm">{children}</div>
    </div>
  );
}

/**
 * Custom MDX components
 */
export const mdxComponents: MDXComponents = {
  Callout,
  TagList,
  MediaEmbed,
  PromptBlock,
  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc list-inside space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal list-inside space-y-2">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 p-4 bg-black/5 dark:bg-white/5 rounded overflow-x-auto">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-black/10 dark:border-white/10 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

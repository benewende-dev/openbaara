import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Texte d'un article, écrit en Markdown dans la console.
 * Le HTML brut n'est pas interprété : seul le Markdown est rendu.
 * Les titres de niveau 1 deviennent des h2 (le h1 est le titre de l'article).
 */
export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => {
            const external = href?.startsWith("http") && !href.includes("openbaara.com");
            return (
              <a href={href} className="link" {...(external ? { target: "_blank", rel: "noopener" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

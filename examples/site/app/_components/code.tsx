import { codeToHtml } from "shiki";
import { PROSE_THEMES } from "@supertype/foundations/rehype";

/**
 * Highlights code the same way the package's MDX pipeline does. With
 * `defaultColor: false`, Shiki writes `--shiki-light` and `--shiki-dark` on each
 * token instead of a fixed colour, and `shiki.css` decides which applies. One
 * pass covers both themes, so switching theme does not re-highlight anything.
 */
export async function Code({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: PROSE_THEMES,
    defaultColor: false,
  });

  return (
    <div
      className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed [&_pre]:bg-transparent!"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

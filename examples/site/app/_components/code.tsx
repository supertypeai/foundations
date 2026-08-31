import { codeToHtml } from "shiki";
import { PROSE_THEMES } from "@supertype.ai/foundations/rehype";

/**
 * Shiki writes `--shiki-light` and `--shiki-dark` per token; `shiki.css` picks one.
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

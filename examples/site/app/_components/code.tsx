import { codeToHtml } from "shiki";
import { PROSE_THEMES } from "@supertype.ai/foundations/rehype";
import { ScrollArea } from "./scroll-area";

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
    <ScrollArea className="rounded-lg border border-border bg-muted/40">
      <div
        className="p-4 text-xs leading-relaxed [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </ScrollArea>
  );
}

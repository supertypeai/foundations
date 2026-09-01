import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { cn, TypographySmall } from "@supertype.ai/foundations";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@supertype.ai/foundations/blocks";
import { Code } from "./code";
import { ScrollArea } from "./scroll-area";

/**
 * A preview and the source that produced it, read off disk at build time so the
 * two stay in step. The tabs come from the package.
 *
 * Preview scaffolding lives here rather than in the demo file, so the code tab
 * reads as the component and nothing else: the scroll area for a matrix wider
 * than the column, and `scale` for a block whose layout only resolves past a
 * container width this page has no room for.
 *
 * `at` is `zoom`, not a transform, and that distinction is the whole point.
 * Zoom divides the coordinate space the preview lays out in, so a demo that
 * asks for nothing but `w-full` is handed a container of `column ÷ zoom`, and
 * its container queries fire on that width honestly, because that is the width
 * it was given. Nobody states a fixed width: the column says how much room
 * there is, the section says how much the block needs, and CSS solves for the
 * scale between them — `tan(atan2(a, b))` being how you divide one length by
 * another. Widen the shell and the scale rises to 1 on its own.
 */
export function Demo({
  source,
  children,
  className,
  scroll,
  at,
}: {
  /** Repo-relative, from the app root, e.g. `app/_demos/headings.tsx`. */
  source: string;
  children: ReactNode;
  className?: string;
  /** Put the preview in a scroll area, for content wider than the column. */
  scroll?: boolean;
  /** Container width the block needs before its layout resolves, e.g. `72rem`. */
  at?: string;
}) {
  const code = readFileSync(join(process.cwd(), source), "utf8");

  // The slack is for rounding: landing on the query's own threshold to the
  // pixel is a coin toss, and losing it drops the layout being demonstrated.
  const preview = at ? (
    <div className="@container">
      <div style={{ zoom: `min(1, tan(atan2(100cqw, calc(${at} + 4rem))))` }}>
        {children}
      </div>
    </div>
  ) : (
    children
  );

  return (
    <Tabs defaultValue="preview" className="mt-4">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">{source.split("/").pop()}</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className={cn("rounded-lg border border-border p-6", className)}>
          {scroll ? <ScrollArea>{preview}</ScrollArea> : preview}
        </div>
        {at ? (
          <TypographySmall className="mt-2 text-muted-foreground">
            scaled to the {at} container this block asks for
          </TypographySmall>
        ) : null}
      </TabsContent>
      <TabsContent value="code">
        <Code code={code} />
      </TabsContent>
    </Tabs>
  );
}

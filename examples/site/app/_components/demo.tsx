import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { cn } from "@supertype.ai/foundations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@supertype.ai/foundations/blocks";
import { Code } from "./code";

/**
 * Shows a preview and the source that produced it. The source is read from the
 * file at build time rather than retyped into a string, so the two cannot get
 * out of sync.
 *
 * The tabs come from the package, so this file also happens to be a working
 * example of `Tabs`.
 */
export function Demo({
  source,
  children,
  className,
}: {
  /** Repo-relative, from the app root — e.g. `app/_demos/headings.tsx`. */
  source: string;
  children: ReactNode;
  className?: string;
}) {
  const code = readFileSync(join(process.cwd(), source), "utf8");

  return (
    <Tabs defaultValue="preview" className="mt-4">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">{source.split("/").pop()}</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className={cn("rounded-lg border border-border p-6", className)}>{children}</div>
      </TabsContent>
      <TabsContent value="code">
        <Code code={code} />
      </TabsContent>
    </Tabs>
  );
}

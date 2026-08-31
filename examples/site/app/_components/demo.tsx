import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { cn } from "@supertype.ai/foundations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@supertype.ai/foundations/blocks";
import { Code } from "./code";

/**
 * A preview and the source that produced it, read off disk at build time so the
 * two stay in step. The tabs come from the package.
 */
export function Demo({
  source,
  children,
  className,
}: {
  /** Repo-relative, from the app root, e.g. `app/_demos/headings.tsx`. */
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

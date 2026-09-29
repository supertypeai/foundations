import type { ComponentProps } from "react";

import { cn } from "../cn.js";

/**
 * The container that spaces a run of prose: paragraphs, lists, headings, fences.
 * None of those carry a margin, so without this they sit flush. The rules live in
 * prose.css because they depend on which block follows which.
 */
export function ProseFlow({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("prose-flow", className)} {...props} />;
}

import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * Numbers are a CSS counter, not markup: reordering renumbers itself, and the
 * digits stay out of the accessibility tree and out of copied text.
 */
export function Steps({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("my-6 [counter-reset:prose-step]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** One step. `title` is its heading; children are the body. */
export function Step({
  title,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & { title?: ReactNode }) {
  return (
    <div
      className={cn(
        "relative border-l border-border pb-6 pl-10 last:border-transparent last:pb-0",
        "[counter-increment:prose-step]",
        "before:absolute before:left-0 before:top-0 before:-translate-x-1/2",
        "before:flex before:h-7 before:w-7 before:items-center before:justify-center",
        "before:rounded-full before:bg-muted before:text-xs before:font-semibold",
        "before:text-foreground before:[content:counter(prose-step)]",
        className,
      )}
      {...props}
    >
      {title ? (
        <div className="mb-1 font-semibold text-foreground">{title}</div>
      ) : null}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

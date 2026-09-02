import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * The line is drawn once on the list, with the active item marking itself with a
 * thumb on top — a border per link breaks the rail into segments that jump on
 * hover. No client hooks, so a server-rendered listing can use it.
 */
export function Rail({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-col border-l border-border", className)}
      {...props}
    />
  );
}

export function RailLink({
  active = false,
  nested = false,
  className,
  children,
  render,
  ...props
}: Omit<ComponentProps<"a">, "children"> & {
  active?: boolean;
  /** A sub-heading under the item above it, indented a step further in. */
  nested?: boolean;
  children: ReactNode;
  /**
   * Swap the anchor for another link element, e.g. `<Link href={…} />`.
   *
   * The one link in the package that does NOT take an `href` and route it
   * itself, and deliberately: this module is reached from `contents.tsx`,
   * `reading.tsx` and `layout.tsx`, which a consumer imports in bare Node and in
   * a test runner with no Next installed. Importing ../href.ts here would put
   * `next/link` on that path — test/essay-toc.test.ts is what holds the line.
   * The rail's own links are `#hash` anchors, which want no router anyway; a
   * rail of routes passes the router's Link through `render`.
   */
  render?: ReactElement<ComponentProps<"a">>;
}) {
  const anchor = {
    ...props,
    "aria-current": active ? ("page" as const) : undefined,
    className: cn(
      "relative block py-1 text-sm leading-snug transition-colors",
      nested ? "pl-6" : "pl-3",
      // The thumb overlaps the list's hairline rather than replacing it, so an
      // inactive neighbour keeps its line and nothing shifts when the active
      // item changes.
      "before:absolute before:inset-y-1 before:-left-px before:w-0.5 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity",
      active
        ? "font-medium text-primary-ink before:opacity-100"
        : "text-muted-foreground hover:text-foreground",
      className,
    ),
    children,
  };

  return <li>{render ? cloneElement(render, anchor) : <a {...anchor} />}</li>;
}

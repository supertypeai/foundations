import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * The vertical index rail, shared by tables of contents, reading panes and any
 * other "you are here" column.
 *
 * Lifted from viably, where three surfaces had each grown their own copy of
 * "every link carries a left border, transparent until current". That draws the
 * rail as a column of stacked segments: the line breaks at every gap and hover
 * thickens a piece of it. Here the line is drawn once, on the list, and the
 * active item marks itself with a rounded thumb sitting on top of it — so the
 * rail stays still while the reader moves down it, which is the whole point.
 *
 * Deliberately free of client hooks, so a server-rendered listing can use it.
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
  /** Swap the anchor for another link element, e.g. `<Link href={…} />`. */
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
        ? "font-medium text-primary before:opacity-100"
        : "text-muted-foreground hover:text-foreground",
      className,
    ),
    children,
  };

  return <li>{render ? cloneElement(render, anchor) : <a {...anchor} />}</li>;
}

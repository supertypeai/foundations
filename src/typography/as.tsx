import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";
import { Mark, shown } from "./mark.js";

/** One union, not a bespoke one per component: the narrow ones only decided, for
 * the reader, that a caption could not be a heading. Classes never change with
 * the tag, so the tag is a prop rather than three more components. */
export type TypographyTag =
  | "span"
  | "p"
  | "div"
  | "small"
  | "label"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

/** A primitive's own props, plus the element choice, marks and truncation. */
export type WithAs<Own = unknown> = ComponentProps<"span"> &
  Own & {
    as?: TypographyTag;
    /** An icon, box or control naming the first line. It renders inside the
     *  element, so it takes its seat from these words at whatever size they are. */
    mark?: ReactNode;
    /** The same, after the words: a tick on a picked row, a checkbox at the edge. */
    markEnd?: ReactNode;
    /** One line, cut with an ellipsis. With a mark the words are cut, never the mark. */
    truncate?: boolean;
  };

/* A leading mark starts the line and the words fill the rest; an end mark follows
 * the words, so their column is only as wide as they are. */
const COLUMNS = {
  start: "grid-cols-[auto_minmax(0,1fr)]",
  end: "grid-cols-[minmax(0,max-content)_auto]",
  both: "grid-cols-[auto_minmax(0,max-content)_auto]",
} as const;

/** Words that may hold blocks, which a phrasing element may not. */
const WORDS_MAY_BE_BLOCKS = new Set<TypographyTag>(["div"]);

/** The cast lives here once instead of in each primitive; a per-tag generic would
 * only narrow `ref`, at the price of a generic in four public signatures. `as`
 * is not forwarded — on the DOM node it is an unknown attribute.
 *
 * `display` is the role's own display, which a marked row replaces with a grid.
 * The caller's `className` outranks both, so `inline-flex` or `hidden sm:flex`
 * still stand; the row's alignment is always the mark's. */
export function TextAs({
  as = "span",
  display,
  mark,
  markEnd,
  truncate = false,
  className,
  children,
  ...props
}: ComponentProps<"span"> &
  Pick<WithAs, "as" | "mark" | "markEnd" | "truncate"> & { display?: string }) {
  const As = as as "span";
  const start = shown(mark);
  const end = shown(markEnd);
  if (!start && !end) {
    return <As className={cn(display, className, truncate && "truncate")} {...props}>{children}</As>;
  }
  const columns = COLUMNS[start && end ? "both" : start ? "start" : "end"];
  const Words = WORDS_MAY_BE_BLOCKS.has(as) ? "div" : "span";
  return (
    <As className={cn("grid gap-x-2", columns, className, "items-baseline")} {...props}>
      {start && <Mark>{mark}</Mark>}
      <Words className={cn("min-w-0", truncate && "truncate")}>{children}</Words>
      {end && <Mark>{markEnd}</Mark>}
    </As>
  );
}

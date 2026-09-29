import { Children, cloneElement, type ComponentProps, type ReactElement, type ReactNode } from "react";

import { cn } from "../cn.js";
import { MARK } from "./align.js";
import type { WithAs } from "./as.js";

/** Whether a mark was given: `cond && <Icon />` passes `false` when there is none. */
export const shown = (mark: ReactNode) => mark != null && mark !== false;

/**
 * The slot on its own, for a glyph inside a run of words: mid-sentence, in a code
 * line, in a menu item's label. It reads the words around it, so it goes inside
 * the element that sets their size. Before words a text role owns, use `mark`.
 */
export function Mark({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="mark" className={cn(MARK, className)} {...props} />;
}

/**
 * A marked title and the lines under it, in one column of words. The title is a
 * text role, whose own `mark` this sets, so the mark reads the title's size. It
 * spans both columns as a subgrid, so the lines under it start where its words
 * do. Without a mark it is a plain stack.
 */
export function Marked({
  mark,
  title,
  as = "div",
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  mark?: ReactNode;
  /** A text role: `TypographyLabel`, `CardTitle` and the rest. */
  title: ReactElement<Pick<WithAs, "className" | "mark">>;
  as?: "div" | "li";
}) {
  const As = as as "div";
  if (!shown(mark)) {
    return (
      <As className={cn("flex flex-col", className)} {...props}>
        {title}
        {children}
      </As>
    );
  }
  // Both gaps are this element's. The title's row would otherwise bring its own
  // `gap-x-2`, and the lines under it would stack with none.
  return (
    <As className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-x-2", className)} {...props}>
      {cloneElement(title, {
        mark,
        className: cn(title.props.className, "col-span-full grid-cols-subgrid gap-x-[inherit]"),
      })}
      {Children.toArray(children).length > 0 && (
        <div className="col-start-2 flex flex-col gap-[inherit]">{children}</div>
      )}
    </As>
  );
}

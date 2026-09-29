import type { ComponentProps, ReactNode } from "react";
/** One union, not a bespoke one per component: the narrow ones only decided, for
 * the reader, that a caption could not be a heading. Classes never change with
 * the tag, so the tag is a prop rather than three more components. */
export type TypographyTag = "span" | "p" | "div" | "small" | "label" | "h1" | "h2" | "h3" | "h4";
/** A primitive's own props, plus the element choice, marks and truncation. */
export type WithAs<Own = unknown> = ComponentProps<"span"> & Own & {
    as?: TypographyTag;
    /** An icon, box or control naming the first line. It renders inside the
     *  element, so it takes its seat from these words at whatever size they are. */
    mark?: ReactNode;
    /** The same, after the words: a tick on a picked row, a checkbox at the edge. */
    markEnd?: ReactNode;
    /** One line, cut with an ellipsis. With a mark the words are cut, never the mark. */
    truncate?: boolean;
};
/** The cast lives here once instead of in each primitive; a per-tag generic would
 * only narrow `ref`, at the price of a generic in four public signatures. `as`
 * is not forwarded — on the DOM node it is an unknown attribute.
 *
 * `display` is the role's own display, which a marked row replaces with a grid.
 * The caller's `className` outranks both, so `inline-flex` or `hidden sm:flex`
 * still stand; the row's alignment is always the mark's. */
export declare function TextAs({ as, display, mark, markEnd, truncate, className, children, ...props }: ComponentProps<"span"> & Pick<WithAs, "as" | "mark" | "markEnd" | "truncate"> & {
    display?: string;
}): import("react").JSX.Element;

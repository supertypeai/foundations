import { type ComponentProps, type ReactElement, type ReactNode } from "react";
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
export declare function Rail({ className, ...props }: ComponentProps<"ul">): import("react").JSX.Element;
export declare function RailLink({ active, nested, className, children, render, ...props }: Omit<ComponentProps<"a">, "children"> & {
    active?: boolean;
    /** A sub-heading under the item above it, indented a step further in. */
    nested?: boolean;
    children: ReactNode;
    /** Swap the anchor for another link element, e.g. `<Link href={…} />`. */
    render?: ReactElement<ComponentProps<"a">>;
}): import("react").JSX.Element;

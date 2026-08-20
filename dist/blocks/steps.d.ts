import type { ComponentProps, ReactNode } from "react";
/**
 * A numbered walkthrough.
 *
 * The numbers are a CSS counter rather than markup, so an author adding or
 * reordering a step never renumbers anything by hand, and the digits stay out of
 * the accessibility tree and out of copied text.
 */
export declare function Steps({ className, children, ...props }: ComponentProps<"div">): import("react").JSX.Element;
/** One step. `title` is its heading; children are the body. */
export declare function Step({ title, className, children, ...props }: Omit<ComponentProps<"div">, "title"> & {
    title?: ReactNode;
}): import("react").JSX.Element;

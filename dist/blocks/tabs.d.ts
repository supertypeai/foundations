import { type ReactNode } from "react";
/**
 * The one stateful block, hence the only `"use client"`. Hand-rolled for the same
 * reason as Accordion: the projects are split across Radix and Base UI. Children
 * pair with `items` **by position** — `value` is for readability and is not
 * matched, since matching would silently drop a panel on an edited label.
 */
export declare function Tabs({ items, children, className, }: {
    /** Tab labels, in order. Paired with the children by position. */
    items: string[];
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/** `value` names the panel at the call site; it is not used for matching. */
export declare function Tab({ children, }: {
    value?: string;
    children: ReactNode;
}): import("react").JSX.Element;

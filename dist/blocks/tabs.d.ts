import { type ReactNode } from "react";
/**
 * A tab group.
 *
 * The one block in the package that carries state, and therefore the one marked
 * `"use client"`. It is hand-rolled on buttons and `role="tabpanel"` rather than
 * taken from Radix or Base UI for the same reason as Accordion: the consuming
 * projects are split across those two libraries, and a shared package that picked
 * one would force a migration for a widget this small.
 *
 * Children are `<Tab>` elements, paired with `items` **by position**. `Tab` takes
 * an optional `value` for readability at the call site; it is not matched against
 * `items`, because doing so would silently drop a panel whose label was edited in
 * one place and not the other. Position is the contract, and it is the one the
 * markup already makes obvious.
 */
export declare function Tabs({ items, children, className, }: {
    /** Tab labels, in order. Paired with the children by position. */
    items: string[];
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/**
 * One panel inside `Tabs`.
 *
 * `value` is documentation at the call site — it names the panel next to its
 * content — and is intentionally not used for matching. See `Tabs`.
 */
export declare function Tab({ children, }: {
    value?: string;
    children: ReactNode;
}): import("react").JSX.Element;

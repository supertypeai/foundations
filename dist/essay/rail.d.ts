import { type ComponentProps, type ReactElement, type ReactNode } from "react";
/**
 * The line is drawn once on the list, with the active item marking itself with a
 * thumb on top — a border per link breaks the rail into segments that jump on
 * hover. No client hooks, so a server-rendered listing can use it.
 */
export declare function Rail({ className, ...props }: ComponentProps<"ul">): import("react").JSX.Element;
export declare function RailLink({ active, nested, className, children, render, ...props }: Omit<ComponentProps<"a">, "children"> & {
    active?: boolean;
    /** A sub-heading under the item above it, indented a step further in. */
    nested?: boolean;
    children: ReactNode;
    /**
     * Swap the anchor for another link element. The one link in the package that
     * does not route its own `href`, deliberately: this module is imported in bare
     * Node and in runners with no Next installed, and ../href.ts would put
     * `next/link` on that path. test/essay-toc.test.ts holds the line.
     */
    render?: ReactElement<ComponentProps<"a">>;
}): import("react").JSX.Element;

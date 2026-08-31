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
}): import("react").JSX.Element;

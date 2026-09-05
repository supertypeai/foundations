import type { ComponentProps } from "react";
import { type LinkBehavior } from "../href.js";
/**
 * An anchor whose destination is this package's decision rather than the call
 * site's, and nothing else. One consumer had thirty-six writing the `target`/`rel`
 * pair by hand, five of them missing the `rel`. Pass `external` for a same-origin
 * path that is not a route, since `Link` prefetches on viewport entry.
 */
export declare function Anchor({ href, external, newTab, ...props }: Omit<ComponentProps<"a">, "href"> & LinkBehavior & {
    href: string;
}): import("react").JSX.Element;

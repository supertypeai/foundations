import { jsx as _jsx } from "react/jsx-runtime";
import { resolveLink } from "../href.js";
/**
 * An anchor whose destination is this package's decision rather than the call
 * site's, and nothing else. One consumer had thirty-six writing the `target`/`rel`
 * pair by hand, five of them missing the `rel`. Pass `external` for a same-origin
 * path that is not a route, since `Link` prefetches on viewport entry.
 */
export function Anchor({ href, external, newTab, ...props }) {
    const { Component, props: link } = resolveLink(href, { external, newTab });
    return _jsx(Component, { ...link, ...props });
}

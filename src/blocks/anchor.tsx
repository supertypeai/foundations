import type { ComponentProps } from "react";

import { resolveLink, type LinkBehavior } from "../href.js";

/**
 * An anchor whose destination is this package's decision rather than the call
 * site's — and nothing else.
 *
 * `Button`, `Badge`, `Card` and `TypographyLink` all take an `href` and hand it
 * to ../href.ts. What was left over was every anchor that is none of those: a
 * thumbnail, a chip, a tooltip trigger, a footer row, an icon in a dialog
 * header. One consumer had thirty-six, each writing `target="_blank"
 * rel="noopener noreferrer"` out by hand, five of them missing the `rel`, four
 * of them putting the pair on a router `Link` — which asks for a client
 * navigation and a new tab in the same breath.
 *
 * No styling, deliberately. `TypographyLink` is the inline link and brings a
 * weight, an ink and an underline with it, which is why it could not take these:
 * they wrap something already drawn, and the only thing they have in common is
 * where they go.
 *
 * Pass `external` for a same-origin path that is not a route — an `/api/…`
 * redirect, a file endpoint. `Link` prefetches on viewport entry, so a signed-URL
 * endpoint would mint one for a link nobody clicked. Call-site props land after
 * the resolved ones, so a link needing a `rel` of its own can still say so.
 */
export function Anchor({
  href,
  external,
  newTab,
  ...props
}: Omit<ComponentProps<"a">, "href"> & LinkBehavior & { href: string }) {
  const { Component, props: link } = resolveLink(href, { external, newTab });
  return <Component {...link} {...props} />;
}

import type { ComponentProps, ReactElement } from "react";
import { Link } from "next-view-transitions";

/**
 * Where a link goes, decided once. This branch was written three times, the
 * expensive copy being every call site reaching for `render={<a href>}`: it looks
 * like a styling escape hatch and is a routing decision made wrongly, and a hero
 * CTA written that way reloads past the router. Components take `href`.
 */

/** A scheme (`mailto:`, `https:`) means the href leaves the app entirely. */
export function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href);
}

export type LinkBehavior = {
  /** Override the scheme sniff: an absolute URL that is home, or a relative one that is not. */
  external?: boolean;
  /**
   * Defaults on for an http(s) href, off for everything else — `mailto:` and
   * `tel:` hand off to another app and have no tab to open.
   */
  newTab?: boolean;
};

/** `Link` requires its own href; as far as a call site here goes it is an anchor. */
type AnchorComponent = (props: ComponentProps<"a">) => ReactElement | null;

export type ResolvedLink = {
  Component: AnchorComponent | "a";
  /** Spread onto the element: the href, plus `target`/`rel` when it opens away. */
  props: ComponentProps<"a">;
  /** For a caller that renders differently for an off-site link — an arrow glyph, an icon. */
  external: boolean;
};

/**
 * What a wrong `href` is worth saying out loud. A value exported from a
 * `"use client"` module and imported by a server component arrives as a boundary
 * stub, which read as `TypeError: href.startsWith is not a function` with an empty
 * stack. `String()` on that stub names the export and the boundary in one line.
 */
function assertHref(href: string): void {
  if (typeof href === "string") return;
  const seen =
    typeof href === "function"
      ? `a function: ${String(href).replace(/\s+/g, " ").slice(0, 160)}`
      : `${typeof href}: ${JSON.stringify(href)}`;
  throw new TypeError(
    `href must be a string, and this one is ${seen}. A function here is usually ` +
      `a value exported from a "use client" module and imported by a server ` +
      `component, which crosses the boundary as a stub rather than a string. ` +
      `Move the constant to a plain module and import it from both sides.`,
  );
}

/**
 * A same-page hash is the one internal href that stays a plain anchor: routing
 * `#section` through the router asks for a navigation and a view transition to
 * reach a place the browser can already scroll to.
 */
export function resolveLink(
  href: string,
  { external, newTab }: LinkBehavior = {},
): ResolvedLink {
  assertHref(href);
  const leavesApp = external ?? isExternalHref(href);
  const away = leavesApp && (newTab ?? href.startsWith("http"));
  const inPage = !leavesApp && href.startsWith("#");
  return {
    Component: leavesApp || inPage ? "a" : (Link as AnchorComponent),
    props: {
      href,
      ...(away ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    },
    external: leavesApp,
  };
}

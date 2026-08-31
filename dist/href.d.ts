import type { ComponentProps, ReactElement } from "react";
/**
 * Where a link goes, decided once.
 *
 * This branch — scheme test, router `Link` or plain `<a>`, `rel` on the way out
 * — was written three times: Card, TypographyLink, and (by omission) every call
 * site that reached for `render={<a href="…" />}` because the component it was
 * calling had no `href` of its own. The last of those is the expensive copy: it
 * looks like a styling escape hatch and is actually a routing decision, made at
 * the call site, wrongly. A hero CTA written that way full-page-reloads past the
 * router and drops the view transition, and nothing in the type system says so.
 *
 * So components take `href`, not an anchor. `render` stays for what it is for:
 * an element that is genuinely not an anchor.
 */
/** A scheme (`mailto:`, `https:`) means the href leaves the app entirely. */
export declare function isExternalHref(href: string): boolean;
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
 * A same-page hash is the one internal href that stays a plain anchor: routing
 * `#section` through the router asks for a navigation and a view transition to
 * reach a place the browser can already scroll to.
 */
export declare function resolveLink(href: string, { external, newTab }?: LinkBehavior): ResolvedLink;
export {};

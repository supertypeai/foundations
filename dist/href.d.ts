import type { ComponentProps, ReactElement } from "react";
/**
 * Where a link goes, decided once. This branch was written three times, the
 * expensive copy being every call site reaching for `render={<a href>}`: it looks
 * like a styling escape hatch and is a routing decision made wrongly, and a hero
 * CTA written that way reloads past the router. Components take `href`.
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

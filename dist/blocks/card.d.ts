import type { ComponentProps, ReactNode } from "react";
import type { ProseLinkComponent } from "../typography/paragraph.js";
/**
 * A grid of cards. Two columns from `sm` up, which is the density that keeps a
 * pair of cards reading as a set rather than as two unrelated panels.
 */
export declare function Cards({ className, children, ...props }: ComponentProps<"div">): import("react").JSX.Element;
type CardBaseProps = {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    children?: ReactNode;
    className?: string;
    /**
     * Force the off-site treatment. Normally inferred from the href having a
     * scheme, which is right for almost every case; this is the override for an
     * absolute URL back to your own site, or a relative one that leaves the app.
     */
    external?: boolean;
};
/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 */
/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 *
 * Unrecognised props pass straight through to the rendered element. Card is one
 * of the few blocks authored by hand in MDX and in page code, and callers
 * legitimately reach for `id`, `width`, `color` and the rest of the HTML surface;
 * enumerating that surface in the type buys nothing and breaks a build every time
 * someone uses an attribute the package had not thought of.
 */
export declare function createCard(LinkComponent: ProseLinkComponent): ({ href, className, external, title, description, icon, children, ...rest }: CardBaseProps & {
    href?: string;
} & Omit<ComponentProps<"a">, keyof CardBaseProps | "href">) => import("react").JSX.Element;
export {};

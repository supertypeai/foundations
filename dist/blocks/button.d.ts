import { type ComponentProps } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { type LinkBehavior } from "../href.js";
declare const button: (props?: ({
    tone?: "muted" | "primary" | "secondary" | "brand" | "success" | "warn" | "destructive" | null | undefined;
    size?: "sm" | "xs" | "lg" | "xl" | "md" | null | undefined;
    icon?: boolean | null | undefined;
    pill?: boolean | null | undefined;
    variant?: "link" | "solid" | "soft" | "outline" | "ghost" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonLook = VariantProps<typeof button>;
/**
 * The class list, for the handful of places that style someone else's element
 * and cannot render a `Button` — a router `Link` inside a `not-found`, a
 * calendar day cell. Takes the same props, including the implied tone.
 */
export declare function buttonVariants(props?: Parameters<typeof button>[0]): string;
/**
 * `href` makes the button a link, and where it goes is ../href.ts's decision.
 * `render={<a href>}` did this before and got a bare anchor: no router, no `rel`
 * off-site. `render` remains for an element that is genuinely neither, a
 * `<label>` or a menu item.
 */
export declare function Button({ className, variant, tone, size, icon, pill, render, nativeButton, href, external, newTab, ...props }: ButtonPrimitive.Props & ButtonLook & LinkBehavior & {
    href?: string;
    /**
     * The one anchor attribute `href` cannot express: a download is a link that
     * is not a navigation. Pair it with `external` for a same-origin route, since
     * `Link` still prefetches on viewport entry, which for an export endpoint
     * means running the export to throw the rows away.
     */
    download?: ComponentProps<"a">["download"];
}): import("react").JSX.Element;
export {};

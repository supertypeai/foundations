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
 * `href` makes the button a link — the anchor is the button, and where the href
 * goes is ../href.ts's decision, not the call site's. `render={<a href="…" />}`
 * did this before, and got a bare anchor: no router, so a CTA reloaded the page
 * and lost the view transition, and an off-site href never grew a `rel`.
 *
 * Either way a non-`<button>` element bypasses the primitive on purpose: Base UI
 * always stamps `type="button"` or `role="button"`, and the latter drops an
 * anchor out of screen-reader link navigation. `render` remains for an element
 * that is genuinely neither — a `<label>`, a menu item.
 */
export declare function Button({ className, variant, tone, size, icon, pill, render, nativeButton, href, external, newTab, ...props }: ButtonPrimitive.Props & ButtonLook & LinkBehavior & {
    href?: string;
    /**
     * The one anchor attribute the `href` branch has to name itself. A download
     * is a link that is not a navigation, so it is the case `href` alone cannot
     * express — and `render={<a download />}`, which is how every call site said
     * it before, is exactly what `linkRules()` now flags. Card already takes it,
     * off `ComponentProps<"a">`; Button and Badge are anchors here too.
     *
     * Pair it with `external` for a same-origin route. `Link` steps aside on the
     * click, but it still prefetches the href on viewport entry, which for an
     * export endpoint means running the export to throw the rows away.
     */
    download?: ComponentProps<"a">["download"];
}): import("react").JSX.Element;
export {};

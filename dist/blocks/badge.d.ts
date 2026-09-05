import type { ComponentProps, ReactElement } from "react";
import { type VariantProps } from "class-variance-authority";
import { type LinkBehavior } from "../href.js";
declare const badge: (props?: ({
    tone?: "muted" | "primary" | "secondary" | "brand" | "success" | "warn" | "destructive" | null | undefined;
    size?: "sm" | "xs" | null | undefined;
    pill?: boolean | null | undefined;
    variant?: "solid" | "soft" | "outline" | "ghost" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type BadgeLook = VariantProps<typeof badge>;
export declare function badgeVariants(props?: Parameters<typeof badge>[0]): string;
/**
 * A `span`, an anchor when given an `href`, and whatever `render` says otherwise.
 * Cloned rather than run through a `useRender` hook, which would make every badge
 * in the tree a client component to serve the one call site rendering an anchor.
 */
export declare function Badge({ className, variant, tone, size, pill, render, href, external, newTab, ...props }: ComponentProps<"span"> & BadgeLook & LinkBehavior & {
    render?: ReactElement;
    href?: string;
    /** A link that is not a navigation. See Button, which documents the pairing with `external`. */
    download?: ComponentProps<"a">["download"];
}): import("react").JSX.Element;
export {};

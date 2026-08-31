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
 * A `span`, an anchor when given an `href` — a tag pill leading to its listing —
 * and whatever `render` says otherwise — cloned rather than run through a
 * `useRender` hook, which is what viably's badge did. A hook would make every
 * badge in the tree a client component to serve the one call site that renders
 * an anchor, and a badge is a label: it should cost nothing on the server. This
 * is the same mechanism `Button` uses for the same reason.
 *
 * The `[a]:hover` rules above light up on their own when an anchor is the parent
 * or the rendered element.
 */
export declare function Badge({ className, variant, tone, size, pill, render, href, external, newTab, ...props }: ComponentProps<"span"> & BadgeLook & LinkBehavior & {
    render?: ReactElement;
    href?: string;
}): import("react").JSX.Element;
export {};

import type { ComponentProps, ReactNode } from "react";
/** Two columns from `sm` up: a pair reads as a set rather than two panels. */
export declare function Cards({ className, children, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardHeader({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
/**
 * No `font-heading`, and no rung off the heading ladder. That role is the
 * editorial display face — `.editorial` hands it to the serif and drops the
 * weight to 400 — and a card is chrome, not prose: dropped into a docs page it
 * wore a serif title over a sans description and lost the weight that separated
 * the two. Rank inside a card is weight and size, the way a callout title does
 * it. The face is whatever the card inherits.
 */
export declare function CardTitle({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardDescription({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardContent({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
type CardShorthand = {
    /** Shorthand header: 52 MDX files use it, and no compiler checks those. */
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    /** Override the scheme sniff: an absolute URL home, or a relative one away. */
    external?: boolean;
};
/**
 * Takes either shape: `title`/`href` fills the header, or compose the slots
 * directly. Unrecognised props pass through — MDX authors reach for the whole
 * HTML surface. An href with a scheme leaves the app; the rest route through
 * the router's Link.
 */
export declare function Card({ href, className, external, title, description, icon, children, ...rest }: CardShorthand & {
    href?: string;
    children?: ReactNode;
} & Omit<ComponentProps<"a">, keyof CardShorthand | "href" | "children">): import("react").JSX.Element;
export {};

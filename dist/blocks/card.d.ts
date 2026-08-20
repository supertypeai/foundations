import type { ComponentProps, ReactNode } from "react";
import type { ProseLinkComponent } from "../typography/paragraph.js";
/** Two columns from `sm` up: a pair reads as a set rather than two panels. */
export declare function Cards({ className, children, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export type CardSize = "default" | "sm";
export declare function CardHeader({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardTitle({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardDescription({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
/** Top-right slot, placed by the header's grid. */
export declare function CardAction({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardContent({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
export declare function CardFooter({ className, ...props }: ComponentProps<"div">): import("react").JSX.Element;
type CardShorthand = {
    /** Shorthand header: 52 MDX files use it, and no compiler checks those. */
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    /** Override the scheme sniff: an absolute URL home, or a relative one away. */
    external?: boolean;
    size?: CardSize;
};
/**
 * Bound to the app's router Link, since the package cannot depend on one. Takes
 * either shape: `title`/`href` fills the header, or compose the slots directly.
 * Unrecognised props pass through — MDX authors reach for the whole HTML surface.
 */
export declare function createCard(LinkComponent: ProseLinkComponent): ({ href, className, external, title, description, icon, size, children, ...rest }: CardShorthand & {
    href?: string;
    children?: ReactNode;
} & Omit<ComponentProps<"a">, keyof CardShorthand | "href" | "children">) => import("react").JSX.Element;
export {};

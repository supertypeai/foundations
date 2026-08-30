import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
declare const button: (props?: ({
    tone?: "muted" | "primary" | "secondary" | "brand" | "success" | "warn" | "destructive" | null | undefined;
    size?: "sm" | "xs" | "md" | "lg" | "xl" | null | undefined;
    icon?: boolean | null | undefined;
    pill?: boolean | null | undefined;
    variant?: "solid" | "link" | "soft" | "outline" | "ghost" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonLook = VariantProps<typeof button>;
/**
 * The class list, for the handful of places that style someone else's element
 * and cannot render a `Button` — a router `Link` inside a `not-found`, a
 * calendar day cell. Takes the same props, including the implied tone.
 */
export declare function buttonVariants(props?: Parameters<typeof button>[0]): string;
/**
 * A non-`<button>` render element bypasses the primitive on purpose: Base UI
 * always stamps `type="button"` or `role="button"`, and the latter drops an
 * anchor out of screen-reader link navigation. Cloning gives it the classes and
 * nothing else.
 */
export declare function Button({ className, variant, tone, size, icon, pill, render, nativeButton, ...props }: ButtonPrimitive.Props & ButtonLook): import("react").JSX.Element;
export {};

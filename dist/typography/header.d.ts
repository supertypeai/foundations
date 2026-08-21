import { type VariantProps } from "class-variance-authority";
declare const h1Variants: (props?: ({
    variant?: "default" | "display" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH1({ className, variant, children, ...props }: React.ComponentProps<"h1"> & VariantProps<typeof h1Variants>): import("react").JSX.Element;
declare const h2Variants: (props?: ({
    variant?: "default" | "display" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** The h2 ramp as a class, for a caller that must render its own element. */
export declare const headingClass: (variant?: VariantProps<typeof h2Variants>["variant"]) => string;
/**
 * `divider` is a rule under the heading, not a size — it used to ride the size
 * axis as `default` vs `unbordered`, which made every call site state a border
 * it had no opinion about in order to reach the size it wanted.
 */
export declare function TypographyH2({ className, variant, divider, children, ...props }: React.ComponentProps<"h2"> & VariantProps<typeof h2Variants> & {
    divider?: boolean;
}): import("react").JSX.Element;
/** The subhead: 16px in the product, 24 on an editorial surface. */
export declare function TypographyH3({ className, children, ...props }: React.ComponentProps<"h3">): import("react").JSX.Element;
/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export declare function TypographyH4({ className, children, ...props }: React.ComponentProps<"h4">): import("react").JSX.Element;
declare const eyebrowVariants: (props?: ({
    tone?: "label" | "heading" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** An all-caps micro-label above a stat or a group of controls. */
export declare function TypographyEyebrow({ className, tone, children, ...props }: React.ComponentProps<"span"> & VariantProps<typeof eyebrowVariants>): import("react").JSX.Element;
export {};

import { type VariantProps } from "class-variance-authority";
import { type WithAs } from "./as.js";
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
declare const h3Variants: (props?: ({
    variant?: "default" | "display" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH3({ className, variant, children, ...props }: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>): import("react").JSX.Element;
/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export declare function TypographyH4({ className, children, ...props }: React.ComponentProps<"h4">): import("react").JSX.Element;
declare const eyebrowVariants: (props?: ({
    tone?: "label" | "heading" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * The eyebrow's ramp as a class, for a caller that cannot render our element —
 * a dialog title primitive, a motion element. Same escape hatch as
 * `headingClass`, and it exists so that a consumer needing the class does not
 * hand-roll a second copy of it that then drifts from the component.
 */
export declare const eyebrowClass: (tone?: VariantProps<typeof eyebrowVariants>["tone"]) => string;
/**
 * An all-caps micro-label above a stat or a group of controls, and — since the
 * deck was folded into it — the standfirst that sits with a page title.
 *
 * `as` covers the case the span cannot: an eyebrow that is also the section's
 * heading. See `TypographyTag` in as.tsx for why the classes hold across tags.
 */
export declare function TypographyEyebrow({ className, tone, as, children, ...props }: WithAs<VariantProps<typeof eyebrowVariants>>): import("react").JSX.Element;
export {};

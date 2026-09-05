import { type VariantProps } from "class-variance-authority";
import { type WithAs } from "./as.js";
/**
 * The heading ladder. A heading does not pick its size: `--text-h1`…`--text-h4` do
 * and `.editorial` retunes all four together, so size is a property of the surface
 * and level is all a call site knows. Tailwind scans comments, so never spell a
 * class out here.
 */
/**
 * The heading face, stated once, composed rather than respelled: a second literal
 * is a level that forked, and a literal weight beside the face synthesises the
 * single-weight serif under `.editorial`. Exported so a non-heading can ask for
 * the face alone, where `headingClass()` is the whole h2 ramp and wrong for one.
 */
export declare const headingFace = "font-heading font-[number:var(--heading-weight)]";
declare const h1Variants: (props?: ({
    variant?: "display" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH1({ className, variant, children, ...props }: React.ComponentProps<"h1"> & VariantProps<typeof h1Variants>): import("react").JSX.Element;
declare const h2Variants: (props?: ({
    variant?: "display" | "default" | null | undefined;
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
    variant?: "display" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH3({ className, variant, children, ...props }: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>): import("react").JSX.Element;
/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export declare function TypographyH4({ className, children, ...props }: React.ComponentProps<"h4">): import("react").JSX.Element;
declare const eyebrowVariants: (props?: ({
    tone?: "muted" | "label" | "heading" | "subtle" | null | undefined;
    size?: "sm" | "xs" | "2xs" | "3xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * The eyebrow's ramp as a class, for a caller that cannot render our element —
 * a dialog title primitive, a motion element. Same escape hatch as
 * `headingClass`. It exists so a consumer needing the class can take ours rather
 * than hand-rolling a copy that drifts from the component.
 */
export declare const eyebrowClass: (tone?: VariantProps<typeof eyebrowVariants>["tone"], size?: VariantProps<typeof eyebrowVariants>["size"]) => string;
/**
 * An all-caps micro-label above a stat or a group of controls, and — since the
 * deck was folded into it — the standfirst that sits with a page title.
 *
 * `as` covers the case the span cannot: an eyebrow that is also the section's
 * heading. See `TypographyTag` in as.tsx for why the classes hold across tags.
 */
export declare function TypographyEyebrow({ className, tone, size, as, children, ...props }: WithAs<VariantProps<typeof eyebrowVariants>>): import("react").JSX.Element;
export {};

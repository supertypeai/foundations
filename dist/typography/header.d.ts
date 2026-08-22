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
declare const h3Variants: (props?: ({
    variant?: "default" | "display" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH3({ className, variant, children, ...props }: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>): import("react").JSX.Element;
/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export declare function TypographyH4({ className, children, ...props }: React.ComponentProps<"h4">): import("react").JSX.Element;
declare const deckVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * The deck: the line of standfirst that sits with a page title and finishes the
 * thought the title started.
 *
 * It belongs to the heading layer rather than the paragraph's, even though it
 * renders a paragraph element — it takes the surface's heading family, weight
 * and slant, which is what every hand-rolled copy of it restated by hand, down
 * to a literal weight that `.editorial` was already overriding to 400.
 *
 * The box shrink-wraps its text by default, because a deck is usually painted:
 * a gradient clipped to the glyphs, a marker behind them. A full-width box
 * paints the line's empty remainder too. The trailing padding goes with it —
 * an italic's last glyph overhangs its advance width, and a box shrunk to that
 * advance clips the overhang out of whatever is doing the painting.
 */
export declare function TypographyDeck({ className, size, children, ...props }: React.ComponentProps<"p"> & VariantProps<typeof deckVariants>): import("react").JSX.Element;
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
 * An all-caps micro-label above a stat or a group of controls.
 *
 * `as` exists for the one case the span cannot serve: an eyebrow that is also
 * the section's heading. A surface that labels its sections this way still owes
 * a screen reader the outline, and the alternative — a hand-rolled `<h2>`
 * wearing these classes — is how the label drifts from the ones beside it.
 * The classes do not change with the element, so it is an element choice
 * rather than a second component, the same call `TypographyCaption` makes.
 */
export declare function TypographyEyebrow({ className, tone, as, children, ...props }: React.ComponentProps<"span"> & VariantProps<typeof eyebrowVariants> & {
    as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4";
}): import("react").JSX.Element;
export {};

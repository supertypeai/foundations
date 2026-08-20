import { type VariantProps } from "class-variance-authority";
declare const h1Variants: (props?: ({
    variant?: "hero" | "display" | "page" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH1({ className, variant, children, ...props }: React.ComponentProps<"h1"> & VariantProps<typeof h1Variants>): import("react").JSX.Element;
declare const h2Variants: (props?: ({
    variant?: "display" | "default" | "unbordered" | "larger" | "essay" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** The h2 ramp as a class, for a caller that must render its own element. */
export declare const headingClass: (variant: VariantProps<typeof h2Variants>["variant"]) => string;
export declare function TypographyH2({ className, variant, children, ...props }: React.ComponentProps<"h2"> & VariantProps<typeof h2Variants>): import("react").JSX.Element;
declare const h3Variants: (props?: ({
    variant?: "default" | "essay" | "entry" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function TypographyH3({ className, variant, children, ...props }: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>): import("react").JSX.Element;
/** The card / panel title: the workhorse heading of a dense surface. */
export declare function TypographyH4({ className, children, ...props }: React.ComponentProps<"h4">): import("react").JSX.Element;
declare const eyebrowVariants: (props?: ({
    tone?: "label" | "heading" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** An all-caps micro-label above a stat or a group of controls. */
export declare function TypographyEyebrow({ className, tone, children, ...props }: React.ComponentProps<"span"> & VariantProps<typeof eyebrowVariants>): import("react").JSX.Element;
export {};

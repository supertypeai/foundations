import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { TextAs } from "./as.js";
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
export const headingFace = "font-heading font-[number:var(--heading-weight)]";
const HEADING_BASE = `scroll-m-20 ${headingFace} text-[color:var(--ink,var(--foreground))]`;
const h1Variants = cva(`${HEADING_BASE} tracking-tight`, {
    variants: {
        variant: {
            /** The page title: 22px in the product, 36 on an editorial surface. */
            default: "text-h1",
            /** A landing hero, drawn to be seen from the top of a scroll. */
            display: "text-4xl sm:text-5xl",
        },
    },
    defaultVariants: { variant: "default" },
});
export function TypographyH1({ className, variant, children, ...props }) {
    return (_jsx("h1", { className: cn(h1Variants({ variant }), className), ...props, children: children }));
}
const h2Variants = cva(`${HEADING_BASE} tracking-[-0.01em] first:mt-0`, {
    variants: {
        variant: {
            /** The section heading: 18px in the product, 30 on an editorial surface. */
            default: "text-h2",
            /** A landing page's section heading, one step over the docs equivalent. */
            display: "text-3xl sm:text-4xl",
        },
    },
    defaultVariants: { variant: "default" },
});
/** The h2 ramp as a class, for a caller that must render its own element. */
export const headingClass = (variant) => h2Variants({ variant });
/**
 * `divider` is a rule under the heading, not a size — it used to ride the size
 * axis as `default` vs `unbordered`, which made every call site state a border
 * it had no opinion about in order to reach the size it wanted.
 */
export function TypographyH2({ className, variant, divider, children, ...props }) {
    return (_jsx("h2", { className: cn(h2Variants({ variant }), divider && "w-fit border-b pb-2", className), ...props, children: children }));
}
const h3Variants = cva(HEADING_BASE, {
    variants: {
        variant: {
            /** The subhead: 16px in the product, 24 on an editorial surface. */
            default: "text-h3",
            /**
             * The lead card in a grid — a featured post, a pinned series. Present at
             * this rung and not below it: h4 is a panel title, and a panel title that
             * reaches for a display size is a section heading wearing the wrong tag.
             */
            display: "text-2xl sm:text-3xl",
        },
    },
    defaultVariants: { variant: "default" },
});
export function TypographyH3({ className, variant, children, ...props }) {
    return (_jsx("h3", { className: cn(h3Variants({ variant }), className), ...props, children: children }));
}
/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export function TypographyH4({ className, children, ...props }) {
    return (_jsx("h4", { className: cn(HEADING_BASE, "text-h4", className), ...props, children: children }));
}
const eyebrowVariants = cva("block uppercase tracking-wider", {
    variants: {
        /** Ink and weight. Every tone states its ink: an eyebrow names the section
         *  under it, and one that takes its colour from its surroundings is not a
         *  heading. Weight is load-bearing too, since caps at this size lose their
         *  shape at 400. */
        tone: {
            heading: "text-xs font-semibold text-[color:var(--ink,var(--foreground))]",
            /** Stat cards invert it: the figure is the headline, so the label yields. */
            label: "text-2xs font-medium text-accent-foreground",
            /** The dense product default: a micro-label over a group of controls,
             *  quiet enough that the rows under it stay the thing being read. */
            muted: "text-2xs font-medium text-[color:var(--ink-muted,var(--muted-foreground))]",
            /** A rung quieter again, for a label the reader only needs on the way past:
             *  a column head in a mock, a rail marker, a key in a spec table. */
            subtle: "text-2xs font-medium text-subtle-foreground",
        },
        /**
         * The rung, when the tone's own is wrong for the surface — a dense table head
         * wants the smallest one, a page standfirst the largest. Declared after the
         * tone so the merge keeps this one, and omitted it leaves the tone's rung
         * standing, which is what every existing call site relies on.
         */
        size: {
            sm: "text-sm",
            xs: "text-xs",
            "2xs": "text-2xs",
            "3xs": "text-3xs",
        },
    },
    defaultVariants: { tone: "heading" },
});
/**
 * The eyebrow's ramp as a class, for a caller that cannot render our element —
 * a dialog title primitive, a motion element. Same escape hatch as
 * `headingClass`. It exists so a consumer needing the class can take ours rather
 * than hand-rolling a copy that drifts from the component.
 */
export const eyebrowClass = (tone, size) => eyebrowVariants({ tone, size });
/**
 * An all-caps micro-label above a stat or a group of controls, and — since the
 * deck was folded into it — the standfirst that sits with a page title.
 *
 * `as` covers the case the span cannot: an eyebrow that is also the section's
 * heading. See `TypographyTag` in as.tsx for why the classes hold across tags.
 */
export function TypographyEyebrow({ className, tone, size, as, children, ...props }) {
    return (_jsx(TextAs, { as: as, className: cn(eyebrowVariants({ tone, size }), className), ...props, children: children }));
}

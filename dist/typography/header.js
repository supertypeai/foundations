import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
// Canonical heading primitives: size, weight and tracking live here, never at a
// call site. The rung is a font-weight utility rather than an arbitrary property
// so tailwind-merge can replace it. Tailwind scans comments — never spell a class
// out here or it becomes a real utility.
const h1Variants = cva("scroll-m-20 font-heading font-[number:var(--heading-weight)] text-foreground", {
    variants: {
        variant: {
            /** Marketing hero titles. Large enough that tight tracking reads as craft. */
            hero: "text-2xl tracking-tight md:text-3xl",
            /** A variant, not a per-page override: a className winning at `sm` still
             * loses to `hero`'s `md` rung. */
            display: "text-4xl tracking-tight sm:text-5xl",
            /** A page title in a denser surface — the top of a panel, not a headline. */
            page: "text-xl tracking-[-0.015em]",
        },
    },
    defaultVariants: { variant: "hero" },
});
export function TypographyH1({ className, variant, children, ...props }) {
    return (_jsx("h1", { className: cn(h1Variants({ variant }), className), ...props, children: children }));
}
const h2Variants = cva("scroll-m-20 font-heading font-[number:var(--heading-weight)] tracking-[-0.01em] text-foreground first:mt-0", {
    variants: {
        variant: {
            default: "w-fit border-b pb-2 text-lg",
            unbordered: "text-lg",
            larger: "text-xl leading-tight",
            /** The section heading one rung under a landing page's `display` h1. */
            display: "text-3xl tracking-tight sm:text-4xl",
            /** Interrupts prose without stopping it, where `display` is drawn to be
             * seen from the top of a scroll. */
            essay: "text-2xl tracking-tight sm:text-3xl",
        },
    },
    defaultVariants: { variant: "default" },
});
/** The h2 ramp as a class, for a caller that must render its own element. */
export const headingClass = (variant) => h2Variants({ variant });
export function TypographyH2({ className, variant, children, ...props }) {
    return (_jsx("h2", { className: cn(h2Variants({ variant }), className), ...props, children: children }));
}
const h3Variants = cva("scroll-m-20 font-heading font-[number:var(--heading-weight)] text-foreground", {
    variants: {
        variant: {
            default: "text-base",
            /** One entry in a timeline: leads its body copy without reading as a break. */
            entry: "text-lg",
            /** The subhead inside an essay section, paired with h2's `essay` rung. */
            essay: "text-xl tracking-tight sm:text-2xl",
        },
    },
    defaultVariants: { variant: "default" },
});
export function TypographyH3({ className, variant, children, ...props }) {
    return (_jsx("h3", { className: cn(h3Variants({ variant }), className), ...props, children: children }));
}
/** The card / panel title: the workhorse heading of a dense surface. */
export function TypographyH4({ className, children, ...props }) {
    return (_jsx("h4", { className: cn("scroll-m-20 font-heading text-base font-[number:var(--heading-weight)] text-foreground", className), ...props, children: children }));
}
const eyebrowVariants = cva("block uppercase tracking-wider", {
    variants: {
        tone: {
            /**
             * Weight is load-bearing here: uppercase at this size loses shape at 400.
             * Primary ink, stated not inherited — an eyebrow names the section under it,
             * and one that turns red from its surroundings is not a heading.
             */
            heading: "text-xs font-semibold text-foreground",
            /** Stat cards invert it: the figure is the headline, so the label yields. */
            label: "text-2xs font-medium text-accent-foreground",
        },
    },
    defaultVariants: { tone: "heading" },
});
/** An all-caps micro-label above a stat or a group of controls. */
export function TypographyEyebrow({ className, tone, children, ...props }) {
    return (_jsx("span", { className: cn(eyebrowVariants({ tone }), className), ...props, children: children }));
}

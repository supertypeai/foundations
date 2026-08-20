import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
// Canonical heading primitives. Everything that renders a heading, a section
// title, or an all-caps label comes from here rather than hand-rolling sizes and
// weights, so the type scale stays uniform across every consuming project.
//
// The weight ramp is 400 body / 500 label / 600 heading, and nothing above.
// `font-bold` (700) is a marketing tool: where a third of the text is already
// emphasised, a fourth weight buys no hierarchy, it just shouts. Hierarchy here
// is carried by size and colour; weight is the accent, not the structure.
//
// That heading rung is `--heading-weight` (see type.css), not a literal
// `font-semibold`, so it moves with the face: a serif drawn at a single weight
// wants 400 where a variable sans wants 600, and asking a browser to synthesise
// the difference smears the hairlines exactly where it shows worst.
//
// The rung is written as a font-weight utility taking an arbitrary value, not as
// a bare arbitrary property. tailwind-merge understands the first as belonging to
// the font-weight group and the second as an unrelated declaration, so with the
// property form a call site passing `font-bold` does not replace the rung: both
// classes survive and stylesheet order picks the winner, which is a bug that
// surfaces only on whichever heading the cascade happens to lose.
//
// Note also that these comments are scanned. Tailwind extracts class candidates
// from the whole file, prose included, so spelling the rejected form out in
// square brackets here would generate it as a real utility — and an invalid one,
// since the illustrative value is not a value. Describe such classes in words.
//
// Tracking runs the way optics require: negative on display sizes, ~0 at body,
// positive only for uppercase micro-labels, where letterforms need the air.
const h1Variants = cva("scroll-m-20 font-heading font-[number:var(--heading-weight)] text-foreground", {
    variants: {
        variant: {
            /** Marketing hero titles. Large enough that tight tracking reads as craft. */
            hero: "text-2xl tracking-tight md:text-3xl",
            /**
             * The display step, one rung above `hero`: the h1 a landing page opens
             * on. Stated as a variant rather than overridden per page, because a
             * className that wins at `sm` still loses to `hero`'s `md` rung.
             */
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
            /**
             * The long-form essay's section heading. `display` is drawn to be seen
             * from the top of a scroll; a page read start to finish wants a heading
             * that interrupts the prose without stopping it.
             */
            essay: "text-2xl tracking-tight sm:text-3xl",
        },
    },
    defaultVariants: { variant: "default" },
});
/**
 * The h2 ramp as a class string, for the rare caller that cannot render a
 * `TypographyH2` because it needs its own element (a `motion.h2` whose children
 * are per-word spans, say). Exported so those callers still derive from the ramp
 * instead of typing the rung out by hand, which is how the two drift apart.
 */
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
             * The heading role. This is the one place weight is genuinely load-bearing:
             * uppercase letterforms at this size lose their shape at 400, and the
             * positive tracking they need to stay readable also thins them out.
             *
             * Drawn in the primary ink rather than the muted one, which is the
             * difference between a caption and a heading: an eyebrow names the section
             * under it, and a panel whose title is quieter than its own body text reads
             * as a stray label. The colour is stated rather than inherited — what a bare
             * span picks up is whatever wraps it, which is correct on a card and wrong
             * inside a `text-destructive` block, and a heading that turns red because of
             * where it was placed is not a heading.
             */
            heading: "text-xs font-semibold text-foreground",
            /**
             * The stat-card role, where the relationship inverts: the figure is the
             * headline and the label only says what it counts, so it gives up the
             * semibold and the primary ink to the number.
             */
            label: "text-2xs font-medium text-accent-foreground",
        },
    },
    defaultVariants: { tone: "heading" },
});
/** An all-caps micro-label above a stat or a group of controls. */
export function TypographyEyebrow({ className, tone, children, ...props }) {
    return (_jsx("span", { className: cn(eyebrowVariants({ tone }), className), ...props, children: children }));
}

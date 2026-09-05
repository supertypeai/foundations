import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { renderAs } from "./render-as.js";
import { resolveLink } from "../href.js";
import { FOCUS_RING } from "./focus.js";
import { INK_ON_FILL, TONE, TONE_SURFACE, impliedTone } from "../tone.js";
// A label that is not a control. Same two axes as Button, spelled the same way:
// `variant` for how much ink, `tone` for what it means. The apps' own lists had
// invented spellings for tones the package already named, and viably's carried a
// `link` variant cargo-culted from the button, which no badge ever used.
const badge = cva(cn("inline-flex w-fit shrink-0 items-center justify-center gap-1", "overflow-hidden border border-transparent font-medium whitespace-nowrap", cn("transition focus-visible:border-ring", FOCUS_RING), "aria-invalid:border-destructive aria-invalid:ring-destructive/20", "[&>svg]:pointer-events-none [&>svg]:size-3!", TONE_SURFACE), {
    // Same cascade order as Button: `pill` beats `size` on radius.
    variants: {
        tone: TONE,
        /**
         * Two rungs: `sm` is the label beside a title, `xs` the figure beside a
         * toolbar control. `leading-none` restates the default on purpose, since
         * `text-3xs` carries its own line-height and lands after the base class.
         */
        size: {
            xs: "h-4 min-w-4 rounded px-1 text-3xs leading-none",
            sm: "h-5 rounded-md px-2 py-0.5 text-xs leading-none",
        },
        pill: { true: "rounded-full", false: "" },
        variant: {
            solid: `bg-(--tone-fill) text-(color:--tone-ink) [a]:hover:bg-(--tone-fill-hover) ${INK_ON_FILL}`,
            soft: "bg-(--tone-wash) text-(color:--tone-hue) [a]:hover:bg-(--tone-wash-hover)",
            outline: "border-(color:--tone-line) text-(color:--tone-hue) [a]:hover:bg-(--tone-wash)",
            ghost: "text-(color:--tone-hue) hover:bg-(--tone-wash)",
        },
    },
    defaultVariants: { variant: "solid", size: "sm", pill: false },
});
export function badgeVariants(props = {}) {
    return badge({ tone: props?.tone ?? impliedTone(props?.variant), ...props });
}
/**
 * A `span`, an anchor when given an `href`, and whatever `render` says otherwise.
 * Cloned rather than run through a `useRender` hook, which would make every badge
 * in the tree a client component to serve the one call site rendering an anchor.
 */
export function Badge({ className, variant, tone, size, pill, render, href, external, newTab, ...props }) {
    const resolved = tone ?? impliedTone(variant);
    const classes = cn(badge({ variant, tone: resolved, size, pill, className }));
    const marks = {
        "data-slot": "badge",
        "data-variant": variant ?? "solid",
        "data-tone": resolved,
    };
    if (href !== undefined) {
        const { Component, props: link } = resolveLink(href, { external, newTab });
        return (_jsx(Component, { ...marks, ...link, className: classes, ...props }));
    }
    const as = renderAs(render, classes, { ...marks, ...props });
    if (as)
        return as;
    return _jsx("span", { ...marks, className: classes, ...props });
}

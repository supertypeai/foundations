import { jsx as _jsx } from "react/jsx-runtime";
import { isValidElement } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { renderAs } from "./render-as.js";
import { resolveLink } from "../href.js";
import { FOCUS_RING } from "./focus.js";
import { INK_ON_FILL, TONE, TONE_SURFACE, impliedTone } from "../tone.js";
// ---------------------------------------------------------------------------
// The control both apps were re-declaring. viably and ssite each carried their
// own `cva` with its own variant list — `default | secondary | accent |
// destructive | ghost | outline | link` in one, the same names minus two plus a
// `rose` in the other — and the two had already drifted on radius, on height,
// and on what `destructive` even means (a solid red fill in ssite, a tinted wash
// in viably).
//
// The fix is not a longer shared list. Those names answer two questions at once:
//
//   variant — how much ink the button spends. Filled, washed, hairline, bare.
//   tone    — what the ink means. See ../tone.ts; Callout and TypographyLink
//             take the same seven, because a component does not get to invent a
//             name for a colour the package has already named. Its default is
//             the one the variant implies — see `impliedTone`.
//
// `destructive` is a tone. `ghost` is a variant. A list holding both can only
// express the pairs someone thought to add, which is why neither app could write
// a quiet destructive button without a className.
//
// Everything else is a modifier, and both are boolean because both have exactly
// two states: `icon` squares the box, `pill` rounds it off. They compose — a
// round icon button is `icon pill` — which is why they are not one `shape` enum.
// ---------------------------------------------------------------------------
const button = cva(cn("inline-flex shrink-0 cursor-pointer items-center justify-center", "border border-transparent bg-clip-padding font-medium whitespace-nowrap", "transition select-none", 
// The border joins the ring where a control has one; the ring itself is shared.
cn(FOCUS_RING, "focus-visible:border-ring"), "active:not-aria-[haspopup]:translate-y-px", "disabled:pointer-events-none disabled:opacity-50", "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", TONE_SURFACE), {
    // Key order is cascade order: `cva` emits these as declared and `cn` resolves
    // a conflict in favour of the last one written. `pill` therefore beats
    // `size` on radius, and `variant` beats `size` on the box — which is what
    // lets `link` shed the height and padding of whatever size it was given.
    // Reordering this object is a visual change.
    variants: {
        tone: TONE,
        /**
         * One ladder, 24px to 40px on a 4px step. `md` is the product default —
         * dense rows of controls beside a table — and `lg`/`xl` the marketing
         * rungs. `--radius-lg` is 10px and theme.css already labels it "buttons,
         * default control"; the two rungs below borrow `md`, because a 10px radius
         * on a 24px box reads as a lozenge.
         */
        size: {
            xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
            sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
            md: "h-8 gap-1.5 rounded-lg px-3 text-sm",
            lg: "h-9 gap-2 rounded-lg px-4 text-sm",
            xl: "h-10 gap-2 rounded-lg px-6 text-sm",
        },
        /** A square box for a lone glyph, on whichever rung you are already on. No second ladder of `icon-sm` names to keep aligned with the first. */
        icon: { true: "px-0", false: "" },
        /** Full-round corners. Marketing surfaces; also every filter chip. */
        pill: { true: "rounded-full", false: "" },
        variant: {
            solid: `bg-(--tone-fill) text-(color:--tone-ink) hover:bg-(--tone-fill-hover) ${INK_ON_FILL}`,
            soft: "bg-(--tone-wash) text-(color:--tone-hue) hover:bg-(--tone-wash-hover)",
            outline: "border-(color:--tone-line) bg-background text-(color:--tone-hue) hover:bg-(--tone-wash)",
            ghost: "text-(color:--tone-hue) hover:bg-(--tone-wash)",
            // No box of its own: a button that reads as a link has to sit on the
            // text baseline, not on a 32px control's centre line.
            link: "h-auto gap-1 rounded-none px-0 py-0 text-(color:--tone-hue) underline-offset-4 hover:underline",
        },
    },
    compoundVariants: [
        { icon: true, size: "xs", class: "size-6" },
        { icon: true, size: "sm", class: "size-7" },
        { icon: true, size: "md", class: "size-8" },
        { icon: true, size: "lg", class: "size-9" },
        { icon: true, size: "xl", class: "size-10" },
    ],
    defaultVariants: {
        variant: "solid",
        size: "md",
        icon: false,
        pill: false,
    },
});
/**
 * The class list, for the handful of places that style someone else's element
 * and cannot render a `Button` — a router `Link` inside a `not-found`, a
 * calendar day cell. Takes the same props, including the implied tone.
 */
export function buttonVariants(props = {}) {
    return button({ tone: props?.tone ?? impliedTone(props?.variant), ...props });
}
/**
 * `href` makes the button a link — the anchor is the button, and where the href
 * goes is ../href.ts's decision, not the call site's. `render={<a href="…" />}`
 * did this before, and got a bare anchor: no router, so a CTA reloaded the page
 * and lost the view transition, and an off-site href never grew a `rel`.
 *
 * Either way a non-`<button>` element bypasses the primitive on purpose: Base UI
 * always stamps `type="button"` or `role="button"`, and the latter drops an
 * anchor out of screen-reader link navigation. `render` remains for an element
 * that is genuinely neither — a `<label>`, a menu item.
 */
export function Button({ className, variant, tone, size, icon, pill, render, nativeButton, href, external, newTab, ...props }) {
    const resolved = tone ?? impliedTone(variant);
    const classes = cn(button({ variant, tone: resolved, size, icon, pill, className }));
    // The resolved axes, stamped: a child can style off its parent's tone, and a
    // test can assert the ramp without asserting a class string.
    const marks = {
        "data-slot": "button",
        "data-variant": variant ?? "solid",
        "data-tone": resolved,
    };
    if (href !== undefined) {
        const { Component, props: link } = resolveLink(href, { external, newTab });
        return (_jsx(Component, { ...marks, ...link, className: classes, ...props }));
    }
    // `render.type !== "button"`: a plain <button/> still goes through the primitive, which
    // is what supplies the native semantics.
    const as = isValidElement(render) && render.type === "button"
        ? null
        : renderAs(render, classes, { ...marks, ...props });
    if (as)
        return as;
    return (_jsx(ButtonPrimitive, { ...marks, className: classes, render: render, nativeButton: nativeButton ?? true, ...props }));
}

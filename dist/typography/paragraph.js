import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { resolveLink } from "../href.js";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { TextAs } from "./as.js";
/** The body layer: two axes and no more. A paragraph picks a rung and an ink; a
 * caption is always secondary ink and picks a size. `lead` was a third rung a
 * breakpoint away from `prose`, and its standfirst role is now the eyebrow's. */
const pVariants = cva("", {
    variants: {
        /**
         * `ui` is interface copy. `prose` is the reading rung, stated here and
         * nowhere else — it had drifted to five copies once already. `--text-lg`
         * resolves larger on an editorial subtree, by design.
         */
        variant: {
            ui: "text-sm",
            prose: "text-pretty text-lg leading-relaxed",
        },
        tone: {
            default: "text-[color:var(--ink,var(--foreground))]",
            muted: "text-[color:var(--ink-muted,var(--muted-foreground))]",
        },
    },
    defaultVariants: { variant: "ui", tone: "default" },
});
/**
 * `as` is here for the reason the caption has it, one step further on: a
 * component that hands its body to a caller cannot know whether what arrives is
 * a sentence or a list, and a paragraph may hold neither a list nor a div. The
 * HTML parser closes the `<p>` early and React reports a hydration error, so
 * every wrapper of that shape (`Callout` was the one) renders `as="div"`.
 */
export function TypographyP({ className, variant, tone, as = "p", children, ...props }) {
    return (_jsx(TextAs, { as: as, className: cn(pVariants({ variant, tone }), className), ...props, children: children }));
}
/** The UI rung in the secondary ink. */
const MUTED = { tone: "muted" };
export function TypographyMuted(props) {
    return _jsx(TypographyP, { ...props, ...MUTED });
}
/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
const PROSE = {
    variant: "prose",
    tone: "muted",
};
export function TypographyProse(props) {
    return _jsx(TypographyP, { ...props, ...PROSE });
}
/**
 * A list, on the same rung axis as the paragraph beside it.
 *
 * The rung composes `pVariants` rather than restating one, so a list cannot
 * drift from the copy it sits under. The old `proseClass` held that property for
 * the prose rung alone.
 *
 * `variant` is here because a list is not always reading copy. A tier card or a
 * bento cell sets its paragraphs in `ui`, and a list pinned to `prose` inside one
 * lands two rungs above the sentence introducing it, with no prop to say so. Call
 * sites answered that by hand-rolling `<ul className="list-disc text-sm">`, which
 * is the shape this replaces.
 *
 * Tone stays pinned to `muted`: a list is body copy, secondary for the same
 * reason the paragraph presets are, and a weight-or-ink argument at the marker
 * is not a thing a call site should be able to start.
 */
const listClass = (variant, ordered) => cn("my-4 flex flex-col gap-1 pl-6 [&>li]:pl-1.5", ordered ? "list-decimal" : "list-disc", pVariants({ variant, tone: "muted" }));
export function TypographyList({ className, children, ordered, variant, ...props }) {
    const List = ordered ? "ol" : "ul";
    return (_jsx(List, { className: cn(listClass(variant, ordered), className), ...props, children: children }));
}
/**
 * The reading rung, pinned. The name predates the axis and keeps every call site
 * that already had it; `Preset` stops one re-opening the rung it names.
 */
const PROSE_LIST = { variant: "prose" };
export function TypographyProseList(props) {
    return _jsx(TypographyList, { ...props, ...PROSE_LIST });
}
/**
 * Meta beside content: timestamps, counts, bylines, the key in a key-value row.
 *
 * Always the secondary ink and never a weight — a caption is secondary because
 * it is muted, and 500 on top would have the colour and the weight arguing.
 * `sm` is the default because meta is separated from body by ink, not size;
 * the smaller rungs are a deliberate step down, not the norm.
 *
 * Leading comes from the rung, as it does for every other primitive here. Two
 * of these rungs used to pin a fixed ratio on top of the ramp, which held a
 * caption apart from the label beside it and overrode the retune an editorial
 * subtree had just made. An app that wants more air under a wrapped caption
 * moves the rung, which is where the rest of the page reads its leading from.
 *
 * `inherit` is the parenthetical inside a heading, an eyebrow or a stat. It
 * takes the size of whatever set it and resets the weight, because the only
 * reason to sit there is to be quieter than the thing you qualify — and every
 * container that sets a size for you sets a weight too.
 */
const captionVariants = cva("text-[color:var(--ink-muted,var(--muted-foreground))]", {
    variants: {
        size: {
            sm: "text-sm",
            xs: "text-xs",
            "2xs": "text-2xs",
            inherit: "font-normal",
        },
    },
    defaultVariants: { size: "sm" },
});
/**
 * `as` covers the one thing that genuinely differs between call sites: whether
 * the run is inline beside its subject or a block under it.
 */
export function TypographyCaption({ className, size, as, children, ...props }) {
    return (_jsx(TextAs, { as: as, className: cn(captionVariants({ size }), className), ...props, children: children }));
}
/**
 * Small print set as a block: a note under the thing it annotates, rather than
 * an aside inline with it. Same rung and same ink as the caption — small print
 * is small because it is muted, and dropping it a rung as well is what made
 * both apps hand-roll their own.
 */
const BLOCK = { as: "p" };
export function TypographySmall(props) {
    return _jsx(TypographyCaption, { ...props, ...BLOCK });
}
/**
 * The label role: a form label, a column header, the key a reader scans for.
 * 500 is the only weight bump a dense surface needs below a heading.
 *
 * The rungs are the caption's, deliberately. A label and a caption are one pair
 * — the key and the value, the name and the note — and a pair that cannot be set
 * at one size is not a pair. Pinning the label to `sm` while the caption had an
 * axis is what sent a key next to an `xs` value out to `font-medium text-xs` in
 * a className, leaving the weight arguing with the rung it landed on.
 *
 * `as` is here for the same reason it is on `TypographyEyebrow`: a config panel
 * names its sections at this size, and those names are the page's outline.
 */
const labelVariants = cva("font-medium text-[color:var(--ink,var(--foreground))]", {
    variants: {
        size: {
            sm: "text-sm",
            xs: "text-xs",
            "2xs": "text-2xs",
            /** Inside a heading or a chip, where the container has already set one. */
            inherit: "",
        },
    },
    defaultVariants: { size: "sm" },
});
export function TypographyLabel({ className, size, as, children, ...props }) {
    return (_jsx(TextAs, { as: as, className: cn(labelVariants({ size }), className), ...props, children: children }));
}
/**
 * A numeric readout. Size and colour ride in via className per use.
 *
 * Tabular is right in a column and wrong in a headline, so it is an axis rather
 * than a constant. Keep `tabular` anywhere a value updates in place.
 *
 * Leading is the one thing here the rung does not decide. A stat sits on the
 * body rungs, whose leading is room for the line that follows, and a value has
 * no line following it: the ratio lands as dead space arguing with the padding
 * the tile around it already sets. Pinned tight, for the reason a badge is.
 */
const statVariants = cva("tracking-tight leading-none", {
    variants: {
        /**
         * Two ladders, because a figure sits in one of two places and they scale
         * apart on an editorial surface. The rung names are the body ramp: a value
         * in a table cell, a chip or a tile, beside interface copy it should step
         * with. The surface names ride the heading ladder, for a figure that is
         * itself the headline, so it and the heading beside it retune together.
         *
         * The heading half shipped alone and covered three call sites in eighteen.
         * The other fifteen wanted a body rung, could not say so, and spelled a
         * class instead, which takes the size and drops everything else the axis
         * carries.
         *
         * `inherit` is the default and writes nothing: a stat inside a heading or a
         * sentence takes the size that set it.
         */
        size: {
            inherit: "",
            "3xs": "text-3xs",
            "2xs": "text-2xs",
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            card: "text-h4",
            panel: "text-h3",
            section: "text-h2",
            page: "text-h1",
            display: "text-6xl font-black",
        },
        /**
         * How loud the value is. `muted` is the qualifier that follows a figure,
         * "of 2,000" beside "1,284": a value, so it keeps the tight leading, and
         * quiet, so it does not compete with what it qualifies. Unweighted for the
         * reason the caption is, that colour and weight both saying "secondary" is
         * one of them arguing with the other.
         *
         * `default` states no ink on purpose. A stat takes the ink around it, which
         * inside a filled control is that control's label and in a muted row is the
         * row's, and naming one here would repaint every stat that inherits a
         * quieter ink deliberately.
         */
        tone: {
            default: "font-semibold",
            muted: "font-normal text-[color:var(--ink-muted,var(--muted-foreground))]",
        },
        figures: {
            /** Even advances stop a value jittering as it refreshes. */
            tabular: "tabular-nums",
            /** A headline figure wants its drawn spacing: a lone 1 is not an 8. */
            proportional: "proportional-nums",
        },
    },
    defaultVariants: { size: "inherit", figures: "tabular", tone: "default" },
});
export function TypographyStat({ className, size, figures, tone, children, ...props }) {
    return (_jsx("span", { className: cn(statVariants({ size, figures, tone }), className), ...props, children: children }));
}
/**
 * A run of code inside a sentence: a command, a field name, a trigger.
 *
 * Everything is in `em`, not a rung: the chip has to sit in whatever size the
 * sentence around it is set at, and the ramp differs per surface. The 0.9 is an
 * optical correction — the mono face carries a taller x-height than the sans.
 */
export function TypographyInlineCode({ className, children, ...props }) {
    return (_jsx("code", { className: cn("rounded-[3px] bg-current/[0.06] px-[0.3em] py-[0.1em] font-mono text-[0.9em] text-[color:var(--ink,var(--secondary-ink))]", className), ...props, children: children }));
}
/**
 * A statement about the surface, not the link: `muted` inside a paragraph,
 * `primary` when the link is the main thing on the line, `secondary` for a note
 * beneath a hero where `primary` would compete with the CTA beside it. The other
 * four come free, and a link inside a warning should be able to say so.
 *
 * This was `foreground | primary | secondary`, a private list whose first member
 * was "no meaning at all" spelled a third way — `foreground` here, `muted` in
 * Callout, `default` on a button. Now it is ../tone.ts, the same seven the other
 * two take, and the weight is uniform: `secondary` alone used to skip
 * `font-medium`, which read as a lighter link rather than a differently-coloured
 * one.
 */
const INHERITED_INK = "text-[color:var(--ink,var(--foreground))]";
const LINK_DECORATION = "underline decoration-dotted decoration-1 decoration-muted-foreground decoration-skip-ink-none underline-offset-2 hover:decoration-solid hover:decoration-current/70";
/**
 * No tone stated means "read the surface": the ink comes from whatever painted
 * the ground, which on a page is `--foreground` and inside a filled control is
 * that control's label ink. The old default spelled this `muted`, whose hue is
 * `--foreground` — identical on a page, and 2.28:1 on a filled button.
 */
const linkClass = (tone, className) => cn(tone ? cn(toneClass(tone), "text-(color:--tone-hue)") : INHERITED_INK, "font-medium", LINK_DECORATION, className);
/**
 * The inline link.
 *
 * Internal and external are decided from the href, never at the call site —
 * ../href.ts holds that decision, and Button, Badge and Card make the same one.
 * `newTab` and `external` are the overrides. Call-site props apply last, so a
 * passed `target`/`rel` still wins.
 *
 * The router is `next-view-transitions`, imported rather than injected. Every
 * project on this package is a Next app and wants the same link, and a factory
 * bought router-agnosticism nobody used at the price of a component that could
 * not be imported by name. One call site ended up on the unbound version that
 * way and lost its decoration.
 */
export function TypographyLink({ href, children, tone = "muted", external: leavesApp, newTab, addArrow, className, ...props }) {
    const style = linkClass(tone, className);
    const { Component, props: link, external } = resolveLink(href, {
        external: leavesApp,
        newTab,
    });
    const body = (_jsxs(_Fragment, { children: [children, addArrow && (_jsx("svg", { "aria-hidden": "true", className: "ml-1 inline size-3.5 align-middle", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: external ? "M7 17 17 7M7 7h10v10" : "M5 12h14M12 5l7 7-7 7" }) }))] }));
    return (_jsx(Component, { className: style, ...link, ...props, children: body }));
}

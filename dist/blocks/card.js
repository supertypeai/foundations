import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { FOCUS_RING } from "./focus.js";
import { inkOnSurface, toneClass } from "../tone.js";
import { resolveLink } from "../href.js";
/** Two columns from `sm` up: a pair reads as a set rather than two panels. */
export function Cards({ className, children, ...props }) {
    return (_jsx("div", { className: cn("my-6 grid gap-4 sm:grid-cols-2", className), ...props, children: children }));
}
/**
 * `ring-1` not `border`: a ring draws outside the box, so a card sits flush in a
 * grid and `overflow-hidden` clips a bleed image cleanly. Padding is vertical
 * only — the horizontal inset belongs to the slots, so bands can run edge to edge.
 */
const CARD_CLASS = `flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-border ${inkOnSurface("--card-foreground")} ` +
    "has-[>img:first-child]:pt-0 " +
    "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl";
/**
 * What a card does when it is a link, which is the only time it does anything: two pixels
 * up, a shadow under it, the ring firming from `--border` to a cut of the page's own ink.
 * Following a link is not a colour, so nothing here is one — `--elevation-raised` is the
 * token for a layer leaving the page plane, and that is the whole gesture. The lift is
 * `motion-safe:` and the shadow is not, so reduced motion keeps the affordance.
 *
 * `toneClass` is declared here so the icon below can take `--tone-hue` rather than naming
 * a token, the way every other tinted role in the package reads it.
 */
const CARD_LINK_CLASS = cn(toneClass("primary"), FOCUS_RING, "group/card no-underline transition duration-200 ease-out", "hover:shadow-raised hover:ring-foreground/15 motion-safe:hover:-translate-y-0.5");
export function CardHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-header", className: cn("grid auto-rows-min items-start gap-1 px-4 [.border-b]:pb-4", className), ...props }));
}
/**
 * No `font-heading`, and no rung off the heading ladder. That role is the
 * editorial display face — `.editorial` hands it to the serif and drops the
 * weight to 400 — and a card is chrome, not prose: dropped into a docs page it
 * wore a serif title over a sans description and lost the weight that separated
 * the two. Rank inside a card is weight and size, the way a callout title does
 * it. The face is whatever the card inherits.
 */
export function CardTitle({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-title", className: cn("text-base leading-snug font-medium", className), ...props }));
}
export function CardDescription({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-description", className: cn("text-sm text-muted-foreground", className), ...props }));
}
export function CardContent({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-content", className: cn("px-4", className), ...props }));
}
/**
 * Takes either shape: `title`/`href` fills the header, or compose the slots
 * directly. Unrecognised props pass through — MDX authors reach for the whole
 * HTML surface. Where the href goes is ../href.ts's call, the same one Button
 * and TypographyLink make.
 */
export function Card({ href, className, external, newTab, title, description, icon, children, ...rest }) {
    const header = title || description || icon ? (_jsxs(CardHeader, { children: [icon || title ? (
            // The icon sits on the title's line and is its mark; stacked, it read as a
            // decoration the title happened to follow. `gap-2` is a gap between two
            // objects, not the header's `gap-1` between two lines.
            _jsxs("div", { className: "flex items-center gap-2", children: [icon ? (
                    // Sized here, not at the call site, so two cards cannot disagree about how
                    // big an icon is. On a link card it takes the tone as the card lifts.
                    _jsx("span", { className: "shrink-0 text-muted-foreground transition-colors group-hover/card:text-(color:--tone-hue) [&_svg]:size-4 [&_svg]:shrink-0", children: icon })) : null, title ? _jsx(CardTitle, { children: title }) : null] })) : null, description ? _jsx(CardDescription, { children: description }) : null] })) : null;
    // Bare children compose; children under a shorthand header are body copy.
    const body = header ? (_jsxs(_Fragment, { children: [header, children ? _jsx(CardContent, { children: children }) : null] })) : (children);
    const shared = { "data-slot": "card" };
    if (!href) {
        return (_jsx("div", { className: cn(CARD_CLASS, className), ...shared, ...rest, children: body }));
    }
    const { Component, props: link } = resolveLink(href, { external, newTab });
    return (_jsx(Component, { className: cn(CARD_CLASS, CARD_LINK_CLASS, className), ...link, ...shared, ...rest, children: body }));
}

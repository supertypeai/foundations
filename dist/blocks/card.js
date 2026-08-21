import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { Link } from "next-view-transitions";
/** Two columns from `sm` up: a pair reads as a set rather than two panels. */
export function Cards({ className, children, ...props }) {
    return (_jsx("div", { className: cn("my-6 grid gap-4 sm:grid-cols-2", className), ...props, children: children }));
}
/**
 * `ring-1` not `border`: a ring draws outside the box, so a card sits flush in a
 * grid and `overflow-hidden` clips a bleed image cleanly. Padding is vertical
 * only — the horizontal inset belongs to the slots, so bands can run edge to edge.
 */
const CARD_CLASS = "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-border " +
    "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 " +
    "data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 " +
    "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl";
export function CardHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-header", className: cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4", "group-data-[size=sm]/card:px-3", "has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]", "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3", className), ...props }));
}
export function CardTitle({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-title", className: cn("font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm", className), ...props }));
}
export function CardDescription({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-description", className: cn("text-sm text-muted-foreground", className), ...props }));
}
/** Top-right slot, placed by the header's grid. */
export function CardAction({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-action", className: cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className), ...props }));
}
export function CardContent({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-content", className: cn("px-4 group-data-[size=sm]/card:px-3", className), ...props }));
}
export function CardFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-footer", className: cn("flex items-center rounded-b-xl border-t border-border bg-muted/50 p-4 group-data-[size=sm]/card:p-3", className), ...props }));
}
/**
 * Takes either shape: `title`/`href` fills the header, or compose the slots
 * directly. Unrecognised props pass through — MDX authors reach for the whole
 * HTML surface. An href with a scheme leaves the app; the rest route through
 * the router's Link.
 */
export function Card({ href, className, external, title, description, icon, size = "default", children, ...rest }) {
    const header = title || description || icon ? (_jsxs(CardHeader, { children: [icon ? _jsx("div", { className: "mb-1 text-muted-foreground", children: icon }) : null, title ? _jsx(CardTitle, { children: title }) : null, description ? _jsx(CardDescription, { children: description }) : null] })) : null;
    // Bare children compose; children under a shorthand header are body copy.
    const body = header ? (_jsxs(_Fragment, { children: [header, children ? _jsx(CardContent, { children: children }) : null] })) : (children);
    const shared = { "data-slot": "card", "data-size": size };
    if (!href) {
        return (_jsx("div", { className: cn(CARD_CLASS, className), ...shared, ...rest, children: body }));
    }
    const leavesApp = external ?? /^[a-z][a-z0-9+.-]*:/i.test(href);
    const classes = cn(CARD_CLASS, "no-underline transition-colors hover:bg-accent", className);
    if (leavesApp) {
        return (_jsx("a", { href: href, className: classes, target: "_blank", rel: "noopener noreferrer", ...shared, ...rest, children: body }));
    }
    return (_jsx(Link, { href: href, className: classes, ...shared, ...rest, children: body }));
}

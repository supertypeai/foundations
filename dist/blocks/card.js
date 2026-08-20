import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/**
 * A grid of cards. Two columns from `sm` up, which is the density that keeps a
 * pair of cards reading as a set rather than as two unrelated panels.
 */
export function Cards({ className, children, ...props }) {
    return (_jsx("div", { className: cn("my-6 grid gap-4 sm:grid-cols-2", className), ...props, children: children }));
}
const CARD_CLASS = "block rounded-xl border border-border bg-card p-4 text-card-foreground no-underline transition-colors";
function CardBody({ title, description, icon, children, }) {
    return (_jsxs(_Fragment, { children: [icon ? _jsx("div", { className: "mb-2 text-muted-foreground", children: icon }) : null, _jsx("div", { className: "font-semibold text-foreground", children: title }), description ? (_jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })) : null, children ? (_jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: children })) : null] }));
}
/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 */
/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 *
 * Unrecognised props pass straight through to the rendered element. Card is one
 * of the few blocks authored by hand in MDX and in page code, and callers
 * legitimately reach for `id`, `width`, `color` and the rest of the HTML surface;
 * enumerating that surface in the type buys nothing and breaks a build every time
 * someone uses an attribute the package had not thought of.
 */
export function createCard(LinkComponent) {
    return function Card({ href, className, external, title, description, icon, children, ...rest }) {
        const body = _jsx(CardBody, { title: title, description: description, icon: icon, children: children });
        if (!href) {
            return (_jsx("div", { className: cn(CARD_CLASS, className), ...rest, children: body }));
        }
        const leavesApp = external ?? /^[a-z][a-z0-9+.-]*:/i.test(href);
        const classes = cn(CARD_CLASS, "hover:bg-accent", className);
        if (leavesApp) {
            return (_jsx("a", { href: href, className: classes, target: "_blank", rel: "noopener noreferrer", ...rest, children: body }));
        }
        return (_jsx(LinkComponent, { href: href, className: classes, ...rest, children: body }));
    };
}

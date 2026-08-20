import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement } from "react";
import { cn } from "../cn.js";
/**
 * A disclosure group.
 *
 * Built on `<details>`/`<summary>` rather than a headless primitive: it needs no
 * JavaScript, works before hydration, is keyboard- and screen-reader-correct for
 * free, and — the reason that matters here — it keeps the package free of both
 * Radix and Base UI. Those diverge across the consuming projects, and a shared
 * prose package that picked one would force a migration on the others for the
 * sake of a widget the platform already ships.
 */
export function Accordions({ className, children, type = "multiple", defaultValue, name, ...props }) {
    // Single-open comes from the shared `name` attribute, which browsers implement
    // natively and which degrades to all-open where they do not — a fine failure
    // for a disclosure group, and far cheaper than shipping state for it.
    const open = defaultValue
        ? new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
        : null;
    const groupName = type === "single" ? (name ?? deriveGroupName(children)) : undefined;
    // Cloned rather than passed through context: a Provider would have to be a
    // client component, and this whole block exists to stay off that boundary.
    const items = Children.map(children, (child) => {
        if (!isValidElement(child))
            return child;
        // defaultValue matches on the title, so it can only match a string one. A
        // JSX title stringifies to "[object Object]" and would match nothing while
        // looking like it should.
        const title = child.props.title;
        const defaultOpen = open && typeof title === "string" ? open.has(title) : undefined;
        return cloneElement(child, {
            name: child.props.name ?? groupName,
            open: child.props.open ?? defaultOpen,
        });
    });
    return (_jsx("div", { className: cn("my-6 divide-y divide-border overflow-hidden rounded-xl border border-border", className), ...props, children: items }));
}
/**
 * A stable group name derived from the children's titles.
 *
 * `<details name>` needs siblings to share a name, and the name must be the same
 * on the server and the client and the same across builds. A module-scoped
 * counter satisfies none of those: module scope lives for the life of the Node
 * process, so the number depends on how many accordions happened to render
 * before this one — different on every build, and different again in the browser.
 *
 * Hashing the titles is deterministic and unique to the group's content. Two
 * groups with identical titles on one page would share a name and behave as one;
 * that is remote enough, and visible enough when it happens, to be the better
 * trade against a value that silently differs between server and client.
 *
 * `useId` is the React answer to this and cannot be used here: it is a hook, and
 * this is a server component.
 */
function deriveGroupName(children) {
    const titles = [];
    Children.forEach(children, (child) => {
        if (isValidElement(child) && typeof child.props.title === "string") {
            titles.push(child.props.title);
        }
    });
    // djb2. Short, stable, and the collision domain here is one page.
    let hash = 5381;
    const source = titles.join("|");
    for (let i = 0; i < source.length; i++) {
        hash = ((hash << 5) + hash + source.charCodeAt(i)) | 0;
    }
    return `accordion-${(hash >>> 0).toString(36)}`;
}
export function Accordion({ title, children, className, ...props }) {
    return (_jsxs("details", { className: cn("group bg-card", className), ...props, children: [_jsxs("summary", { className: "flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground marker:hidden hover:bg-accent [&::-webkit-details-marker]:hidden", children: [title, _jsx("svg", { "aria-hidden": "true", className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m6 9 6 6 6-6" }) })] }), _jsx("div", { className: "px-4 pb-4 text-sm text-muted-foreground", children: children })] }));
}

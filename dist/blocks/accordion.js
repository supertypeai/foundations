import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement } from "react";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { DISCLOSURE, DisclosureChevron } from "./disclosure.js";
/**
 * A disclosure group: `<details>`/`<summary>`, no JS, correct before hydration.
 * Named for what it is rather than `Accordion`, the interactive Base UI component
 * next door. Sharing a name is how a call site ends up with the wrong one.
 */
export function DisclosureGroup({ className, children, type = "multiple", defaultValue, name, tone = "primary", ...props }) {
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
    return (_jsx("div", { className: cn(toneClass(tone), DISCLOSURE.group, className), ...props, children: items }));
}
/**
 * `<details name>` must match across siblings, server and client, and builds — a
 * module counter fails all three, and `useId` is a hook in a server component.
 * Hashing the titles is deterministic; identical groups on one page would merge.
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
export function Disclosure({ title, children, className, ...props }) {
    return (_jsxs("details", { className: cn("group/disclosure", DISCLOSURE.item, className), ...props, children: [_jsxs("summary", { className: cn(DISCLOSURE.row, "list-none marker:hidden [&::-webkit-details-marker]:hidden"), children: [title, _jsx(DisclosureChevron, {})] }), _jsx("div", { className: DISCLOSURE.panel, children: children })] }));
}

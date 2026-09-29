import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement } from "react";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { FOCUS_RING } from "./focus.js";
/**
 * The disclosure: `<details>`/`<summary>`, no JS, correct before hydration, and
 * available to an MDX author. The one way to show and hide a row; an animated
 * client-side accordion beside it was the same control twice.
 *
 * The look is the tab strip's `line` variant: no box, no fill, a hairline between
 * rows, and one 2px mark in `--tone-hue` naming what is open. Ink carries the state,
 * muted at rest and `--foreground` open, exactly as a tab label does, since an open
 * row is being read rather than signalled. The mark is per row and scales in, where
 * the tab strip's slides: any number of rows can be open, and one element cannot be
 * in two of them.
 *
 * Everything moves on one 200ms ease-out, the tab marker's, because the mark, the
 * ink and the panel are one gesture.
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
    // A rule between rows and nothing around them: the group is a set of lines on
    // the page, not a panel sitting on it. Its room is its container's to give.
    return (_jsx("div", { className: cn(toneClass(tone), "flex flex-col", className), ...props, children: items }));
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
    return `disclosure-${(hash >>> 0).toString(36)}`;
}
export function Disclosure({ title, children, className, ...props }) {
    return (_jsxs("details", { className: cn(
        // One row and its panel. A rule after the last would be a floor under the
        // group, except when the group is one row: a lone rule under a line of text
        // reads as an underline, not a control. That row takes a muted wash instead,
        // the one fill this look allows, since with no neighbour there is no list for
        // a hairline to belong to, and the wash is what says it can be pressed.
        "group/disclosure border-border not-last:border-b only:rounded-md only:bg-muted", 
        // The panel opens on the mark's 200ms. `::details-content` is the browser's
        // own box for it, and `interpolate-size` lets its height move to `auto`; a
        // browser without either opens it at once, which is what it did before.
        "[interpolate-size:allow-keywords] [&::details-content]:h-0 [&::details-content]:overflow-hidden", "[&::details-content]:transition-[height,content-visibility] [&::details-content]:duration-200 [&::details-content]:ease-out [&::details-content]:[transition-behavior:allow-discrete]", "open:[&::details-content]:h-auto motion-reduce:[&::details-content]:transition-none", className), ...props, children: [_jsxs("summary", { className: cn(
                // `pl-4` sets the label 14px clear of the 2px mark. The radius is the focus
                // ring's; hover moves the ink and nothing else, since a full-width wash is
                // the boxed idiom this look exists to avoid. The lone row borrows the wash's
                // radius and a `pr-4`, so the ring and the chevron sit inside it.
                "relative flex w-full cursor-pointer list-none items-center justify-between gap-4 marker:hidden [&::-webkit-details-marker]:hidden", "rounded-sm py-3 pl-4 pr-1 text-left text-sm font-medium group-only/disclosure:rounded-md group-only/disclosure:pr-4", "text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground group-open/disclosure:text-foreground", FOCUS_RING, "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:scale-y-0 before:bg-(--tone-hue)", "before:transition-transform before:duration-200 before:ease-out motion-reduce:before:transition-none", "group-open/disclosure:before:scale-y-100", 
                // The lone row has no mark: it is not one of a list, so there is nothing to
                // point at, and a square bar pokes out of the wash's rounded corners.
                "group-only/disclosure:before:hidden"), children: [title, _jsx(Chevron, {})] }), _jsx("div", { className: "pb-4 pl-4 pr-1 text-sm text-muted-foreground group-only/disclosure:pr-4", children: children })] }));
}
/**
 * The one glyph, inline rather than imported, since one path is not a dependency.
 * It rotates rather than being swapped for a second drawing, since a mark that is
 * replaced cannot animate between states, and takes the mark's ink when open.
 */
function Chevron() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: cn("pointer-events-none size-[1em] shrink-0 text-muted-foreground", "transition-[transform,color] duration-200 ease-out motion-reduce:transition-none", "group-open/disclosure:rotate-180 group-open/disclosure:text-(color:--tone-hue)"), children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
}

"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Rail, RailLink } from "./rail.js";
import { useScrollSpy } from "./scroll.js";
/**
 * The margin index, with the section you are in marked. Separate from
 * `EssayLayout` so only this nav crosses the client boundary.
 */
export function TableOfContents({ sections, label = "On this page", }) {
    const active = useScrollSpy(sections.map((s) => s.id));
    // Nothing to index is nothing to render: an empty list would still draw the
    // label and the rail's hairline in the margin. `ReadingRail` bails the same
    // way. Placed after the hook so the call order never changes.
    if (sections.length === 0)
        return null;
    return (_jsxs("nav", { "aria-label": "Page sections", children: [label ? (_jsx("p", { className: "mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground", children: label })) : null, _jsx(Rail, { children: sections.map(({ id, label: text }) => (_jsx(RailLink, { href: `#${id}`, active: active === id, children: text }, id))) })] }));
}

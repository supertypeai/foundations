"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useState } from "react";
import { cn } from "../cn.js";
/**
 * A tab group.
 *
 * The one block in the package that carries state, and therefore the one marked
 * `"use client"`. It is hand-rolled on buttons and `role="tabpanel"` rather than
 * taken from Radix or Base UI for the same reason as Accordion: the consuming
 * projects are split across those two libraries, and a shared package that picked
 * one would force a migration for a widget this small.
 *
 * Children are `<Tab>` elements, paired with `items` **by position**. `Tab` takes
 * an optional `value` for readability at the call site; it is not matched against
 * `items`, because doing so would silently drop a panel whose label was edited in
 * one place and not the other. Position is the contract, and it is the one the
 * markup already makes obvious.
 */
export function Tabs({ items, children, className, }) {
    const [active, setActive] = useState(0);
    const id = useId();
    const panels = Array.isArray(children) ? children : [children];
    return (_jsxs("div", { className: cn("my-6", className), children: [_jsx("div", { role: "tablist", className: "flex gap-1 border-b border-border", children: items.map((label, i) => (_jsx("button", { role: "tab", type: "button", id: `${id}-tab-${i}`, "aria-selected": active === i, "aria-controls": `${id}-panel-${i}`, onClick: () => setActive(i), className: cn("-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors", active === i
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"), children: label }, label))) }), panels.map((panel, i) => (_jsx("div", { role: "tabpanel", id: `${id}-panel-${i}`, "aria-labelledby": `${id}-tab-${i}`, hidden: active !== i, className: "pt-4 text-sm text-muted-foreground", children: panel }, i)))] }));
}
/**
 * One panel inside `Tabs`.
 *
 * `value` is documentation at the call site — it names the panel next to its
 * content — and is intentionally not used for matching. See `Tabs`.
 */
export function Tab({ children, }) {
    return _jsx(_Fragment, { children: children });
}

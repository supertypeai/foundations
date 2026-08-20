"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useState } from "react";
import { cn } from "../cn.js";
/**
 * The one stateful block, hence the only `"use client"`. Hand-rolled for the same
 * reason as Accordion: the projects are split across Radix and Base UI. Children
 * pair with `items` **by position** — `value` is for readability and is not
 * matched, since matching would silently drop a panel on an edited label.
 */
export function Tabs({ items, children, className, }) {
    const [active, setActive] = useState(0);
    const id = useId();
    const panels = Array.isArray(children) ? children : [children];
    return (_jsxs("div", { className: cn("my-6", className), children: [_jsx("div", { role: "tablist", className: "flex gap-1 border-b border-border", children: items.map((label, i) => (_jsx("button", { role: "tab", type: "button", id: `${id}-tab-${i}`, "aria-selected": active === i, "aria-controls": `${id}-panel-${i}`, onClick: () => setActive(i), className: cn("-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors", active === i
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"), children: label }, label))) }), panels.map((panel, i) => (_jsx("div", { role: "tabpanel", id: `${id}-panel-${i}`, "aria-labelledby": `${id}-tab-${i}`, hidden: active !== i, className: "pt-4 text-sm text-muted-foreground", children: panel }, i)))] }));
}
/** `value` names the panel at the call site; it is not used for matching. */
export function Tab({ children, }) {
    return _jsx(_Fragment, { children: children });
}

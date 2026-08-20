import { jsx as _jsx } from "react/jsx-runtime";
import { cloneElement } from "react";
import { cn } from "../cn.js";
/**
 * The line is drawn once on the list, with the active item marking itself with a
 * thumb on top — a border per link breaks the rail into segments that jump on
 * hover. No client hooks, so a server-rendered listing can use it.
 */
export function Rail({ className, ...props }) {
    return (_jsx("ul", { className: cn("flex flex-col border-l border-border", className), ...props }));
}
export function RailLink({ active = false, nested = false, className, children, render, ...props }) {
    const anchor = {
        ...props,
        "aria-current": active ? "page" : undefined,
        className: cn("relative block py-1 text-sm leading-snug transition-colors", nested ? "pl-6" : "pl-3", 
        // The thumb overlaps the list's hairline rather than replacing it, so an
        // inactive neighbour keeps its line and nothing shifts when the active
        // item changes.
        "before:absolute before:inset-y-1 before:-left-px before:w-0.5 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity", active
            ? "font-medium text-primary before:opacity-100"
            : "text-muted-foreground hover:text-foreground", className),
        children,
    };
    return _jsx("li", { children: render ? cloneElement(render, anchor) : _jsx("a", { ...anchor }) });
}

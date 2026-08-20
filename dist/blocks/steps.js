import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/**
 * Numbers are a CSS counter, not markup: reordering renumbers itself, and the
 * digits stay out of the accessibility tree and out of copied text.
 */
export function Steps({ className, children, ...props }) {
    return (_jsx("div", { className: cn("my-6 [counter-reset:prose-step]", className), ...props, children: children }));
}
/** One step. `title` is its heading; children are the body. */
export function Step({ title, className, children, ...props }) {
    return (_jsxs("div", { className: cn("relative border-l border-border pb-6 pl-10 last:border-transparent last:pb-0", "[counter-increment:prose-step]", "before:absolute before:left-0 before:top-0 before:-translate-x-1/2", "before:flex before:h-7 before:w-7 before:items-center before:justify-center", "before:rounded-full before:bg-muted before:text-xs before:font-semibold", "before:text-foreground before:[content:counter(prose-step)]", className), ...props, children: [title ? (_jsx("div", { className: "mb-1 font-semibold text-foreground", children: title })) : null, _jsx("div", { className: "text-sm text-muted-foreground", children: children })] }));
}

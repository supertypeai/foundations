import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared, setting body copy on a different axis per page.
 * The measure grows per breakpoint — a comfortable line length is a range.
 */
export function EssayColumns({ aside, children, className, ...props }) {
    return (_jsxs("div", { className: cn("mx-auto grid w-full max-w-6xl gap-10 px-6", "lg:grid-cols-[1fr_minmax(0,42rem)_1fr] lg:gap-0", "xl:max-w-7xl xl:grid-cols-[1fr_minmax(0,44rem)_1fr]", "2xl:max-w-[84rem] 2xl:grid-cols-[1fr_minmax(0,46rem)_1fr]", className), ...props, children: [_jsx("div", { className: "hidden lg:block lg:pr-10", children: aside }), _jsx("div", { className: "mx-auto w-full min-w-0 max-w-2xl lg:max-w-none", children: children }), _jsx("div", { className: "hidden lg:block" })] }));
}
/** A separator between meta items. Decorative, so it is hidden from assistive tech. */
export function MetaDot({ className }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("text-muted-foreground/50", className), children: "\u00B7" }));
}
/** The row of meta beneath a title: byline, date, reading time, tags. */
export function PostMetaRow({ className, children, size = "base", ...props }) {
    return (_jsx("div", { className: cn("flex flex-wrap items-center gap-x-2 text-muted-foreground", size === "sm" ? "text-xs" : "text-sm", className), ...props, children: children }));
}
/**
 * `<time datetime>` carries the machine value beside the human one. Fixed to
 * `en-US`, not the visitor's locale: server and client must agree or React
 * reports a hydration mismatch, and the server cannot see their locale.
 */
export function PostDate({ date, format = "short", className, }) {
    const value = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(value.getTime()))
        return null;
    const label = value.toLocaleDateString("en-US", {
        year: "numeric",
        month: format === "long" ? "long" : "short",
        day: "numeric",
    });
    return (_jsx("time", { dateTime: value.toISOString(), className: className, children: label }));
}
/** Estimated reading time. Pair with `readingTime()` from the toc module. */
export function ReadTime({ minutes, className, }) {
    return _jsxs("span", { className: className, children: [minutes, " min read"] });
}
/** Topic tags, as quiet pills. */
export function TagPills({ tags, className, }) {
    if (tags.length === 0)
        return null;
    return (_jsx("span", { className: cn("flex flex-wrap gap-1.5", className), children: tags.map((tag) => (_jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground", children: tag }, tag))) }));
}

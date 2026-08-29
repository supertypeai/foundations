import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared, setting body copy on a different axis per page.
 * The measure grows per step — a comfortable line length is a range.
 *
 * The margin track is what the third one buys, and it only exists if the
 * container can pay for it:
 *
 *   aside = (container − 3rem padding − measure) ÷ 2 − 2.5rem gutter
 *
 * At 72rem, the grid's own first cap, that is 11rem — enough for a rail. At
 * `lg` (64rem), where this used to switch on, it is 7rem, and a `text-sm` label
 * past about thirteen characters wraps. So the reveal is pinned to the width
 * the three tracks were drawn for rather than to a viewport step that happens
 * to be near it.
 *
 * A container query, not a media query, because the answer depends on the room
 * this shell was given and not on the size of the window. Mounted in something
 * narrower — a docs page with its own 64rem column — it now drops the rail and
 * sets the prose centred, which is a layout, where before it drew a 5.5rem
 * margin and called it one.
 */
export function EssayColumns({ aside, children, className, ...props }) {
    return (_jsx("div", { className: "@container w-full", children: _jsxs("div", { className: cn("mx-auto grid w-full max-w-6xl gap-10 px-6", "@6xl:grid-cols-[1fr_minmax(0,42rem)_1fr] @6xl:gap-0", "@7xl:max-w-7xl @7xl:grid-cols-[1fr_minmax(0,44rem)_1fr]", "@min-[84rem]:max-w-[84rem] @min-[84rem]:grid-cols-[1fr_minmax(0,46rem)_1fr]", className), ...props, children: [_jsx("div", { className: "hidden @6xl:block @6xl:pr-10", children: aside }), _jsx("div", { className: "mx-auto w-full min-w-0 max-w-2xl @6xl:max-w-none", children: children }), _jsx("div", { className: "hidden @6xl:block" })] }) }));
}
/** A separator between meta items. Decorative, so it is hidden from assistive tech. */
export function MetaDot({ className }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("text-muted-foreground/50", className), children: "\u00B7" }));
}
/** The row of meta beneath a title: byline, date, reading time, tags. */
export function PostMetaRow({ className, children, size = "base", ...props }) {
    return (_jsx("div", { className: cn("flex flex-wrap items-center gap-x-2 text-muted-foreground", size === "sm" ? "text-xs" : "text-sm", className), ...props, children: children }));
}
const DATE_FMT = {
    short: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }),
    long: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }),
};
/**
 * The date string, outside React. An OG image builds one in a plain function and
 * the index builds one in a component; two formatters is how the two drift.
 *
 * Fixed to `en-US`, not the visitor's locale: server and client must agree or
 * React reports a hydration mismatch, and the server cannot see their locale.
 * The index abbreviates because its dates sit inside a card's metadata line; an
 * article spells the month out under a display title.
 */
export const formatPostDate = (date, format = "short") => DATE_FMT[format].format(typeof date === "string" ? new Date(date) : date);
/** `<time datetime>` carries the machine value beside the human one. */
export function PostDate({ date, format, className, }) {
    const value = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(value.getTime()))
        return null;
    return (_jsx("time", { dateTime: value.toISOString(), className: className, children: formatPostDate(value, format) }));
}
/**
 * Estimated reading time. Pair with `readingTime()` from the toc module.
 * `icon` is injected, so the package needs no icon set of its own.
 */
export function ReadTime({ minutes, icon: Icon, className, }) {
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1", className), children: [Icon && _jsx(Icon, { className: "size-3.5" }), minutes, " min read"] }));
}
/** Topic tags, as quiet pills. */
export function TagPills({ tags, className, }) {
    if (tags.length === 0)
        return null;
    return (_jsx("span", { className: cn("flex flex-wrap gap-1.5", className), children: tags.map((tag) => (_jsx("span", { className: "rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary", children: tag }, tag))) }));
}

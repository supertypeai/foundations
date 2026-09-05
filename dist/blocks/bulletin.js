import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { INK_ON_CARD } from "../tone.js";
import { TypographyCaption, TypographyLabel, TypographyMuted, } from "../typography/paragraph.js";
import { TypographyEyebrow, TypographyH3 } from "../typography/header.js";
/**
 * The shell. Every slot is optional, and an omitted one renders nothing rather
 * than an empty box, so the same component covers a full credits panel and a
 * headline with one button under it.
 */
export function Bulletin({ variant = "card", accent, eyebrow, headline, lede, points, action, footnote, children, className, }) {
    if (variant === "line") {
        return (_jsxs("div", { className: cn("flex flex-wrap items-center gap-x-4 gap-y-3", "pt-4", className), children: [action, accent, lede && _jsx(TypographyCaption, { size: "2xs", children: lede })] }));
    }
    const rule = action || footnote;
    return (_jsxs("section", { className: cn("overflow-hidden rounded-xl border border-border", 
        // It paints, so it hands down its ink.
        "bg-card", INK_ON_CARD, className), children: [accent, _jsxs("div", { className: "p-6 sm:p-8", children: [eyebrow && (_jsx(TypographyEyebrow, { tone: "subtle", children: eyebrow })), headline && (_jsx(TypographyH3, { className: cn("max-w-lg", eyebrow && "mt-2"), children: headline })), lede && (_jsx(TypographyMuted, { as: "p", className: "mt-2 max-w-xl", children: lede })), points && points.length > 0 && (
                    // A lone point takes the width. Two columns holding one of them is a
                    // grid drawn around an empty cell.
                    _jsx("ul", { className: cn("mt-7 grid gap-6", points.length > 1 && "sm:grid-cols-2"), children: points.map(({ title, body, mark, ink }, i) => (_jsxs("li", { children: [_jsxs(TypographyLabel, { as: "p", size: "xs", className: cn("flex items-center gap-2", ink), children: [mark && (_jsx("span", { "aria-hidden": true, className: cn("size-2 rounded-full", mark) })), title] }), _jsx(TypographyCaption, { as: "p", size: "xs", className: "mt-1.5", children: body })] }, i))) })), rule && (_jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5", children: [action, footnote && (_jsx(TypographyCaption, { size: "2xs", children: footnote }))] })), children && (_jsx(TypographyCaption, { as: "div", size: "xs", className: cn(rule && "mt-5"), children: children }))] })] }));
}
/**
 * The categorical palette in ribbon order, warm through green through cool, so
 * the run reads as one spectrum. Written out one full classname at a time:
 * Tailwind generates only what it sees, and a template string would purge them all.
 */
export const EDITORIAL_INKS = [
    { name: "terracotta", fill: "bg-terracotta" },
    { name: "ochre", fill: "bg-ochre" },
    { name: "moss", fill: "bg-moss" },
    { name: "fern", fill: "bg-fern" },
    { name: "sage", fill: "bg-sage" },
    { name: "stone", fill: "bg-stone" },
    { name: "fig", fill: "bg-fig" },
    { name: "cocoa", fill: "bg-cocoa" },
];
/**
 * A band of hues, for a `Bulletin`'s `accent`. Decorative, so it is hidden from
 * the reader that cannot see it and carries a `title` for the one that can:
 * hovering names the hue, and the segment widens to show the cut at full size.
 *
 * `h-1.5 w-full` on a panel and `h-1 min-w-20 flex-1 rounded-full` in a row —
 * stated by the caller, since the two shapes have nothing in common but the
 * colours.
 */
export function Ribbon({ hues = EDITORIAL_INKS, className, }) {
    return (_jsx("div", { "aria-hidden": true, className: cn("flex overflow-hidden", className), children: hues.map(({ name, fill }) => (_jsx("span", { title: name, className: cn("flex-1 transition-[flex-grow] duration-500 ease-out hover:grow-[2.5]", fill) }, name))) }));
}

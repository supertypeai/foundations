import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { Button } from "./button.js";
import { Bulletin, EDITORIAL_INKS, Ribbon, } from "./bulletin.js";
// ---------------------------------------------------------------------------
// A compact statement block for a footer, a section, or a page.
//
// Colophon keeps the name because it matches the role: a short note about the
// system behind the site. The layout is shared with Bulletin, while the copy
// here is the package's own preset.
//
// The panel uses the editorial inks and the row uses the same mark in a tighter
// layout. The content is mostly fixed, but the label and children can be
// replaced for a site that wants its own wording.
// ---------------------------------------------------------------------------
/** Where the mark points. Exported because a footer sometimes wants the bare
 *  href — a `<link rel="…">`, a sitemap entry, an analytics label. */
export const FOUNDATIONS_URL = "https://github.com/supertypeai/foundations";
/**
 * The two claims, each paired with a hue from the ribbon above it.
 *
 * They are short statements about how the package is built and how the system
 * is checked.
 */
const CLAIMS = [
    {
        mark: "bg-terracotta",
        ink: "text-terracotta-ink",
        title: "Decisions live in one place",
        body: "Utility classes are for styling. The actual decision belongs in the design system. Every type style, tone, and divider on this page comes from one package, so a change is one diff instead of a search through the app.",
    },
    {
        mark: "bg-sage",
        ink: "text-sage-ink",
        title: "Every colour is measured twice",
        body: "WCAG tells us whether a colour passes the audit. APCA's Lc tells us how it feels in context, since the same contrast can read differently on different backgrounds. Both checks run against the shipped stylesheet in light and dark mode, so CI catches anything that slips.",
    },
];
const HEADLINE = "Designed with intention and mathematical rigor.";
/** The panel has a paragraph's room under its headline. */
const LEDE = "Typography primitives, semantic tokens, the essay shell, and contrast checks in one package, enforced in CI.";
/** The row has a line. Sharing `LEDE` with the panel put a paragraph in a
 *  footer, where it wrapped under the ribbon and stopped being a row. */
const NOTE = "Colors, typography, and blocks, tested and measured.";
const FOOTNOTE = "Open source design system by Supertype. MIT licensed.";
/**
 * The palette reduced to a small chip. It is small enough for a footer row and
 * still recognisable from the full panel.
 */
export function FoundationsMark({ className }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("grid size-4 shrink-0 grid-cols-4 grid-rows-2 overflow-hidden rounded-[3px]", className), children: EDITORIAL_INKS.map(({ name, fill }) => (_jsx("span", { className: fill }, name))) }));
}
/**
 * The trailing arrow. It sits just under the text and keeps the link visually
 * aligned with the other controls.
 */
function Arrow() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "size-3 opacity-60 transition-opacity group-hover:opacity-100", children: _jsx("path", { d: "M7 17 17 7M7 7h10v10" }) }));
}
/**
 * The standalone link. It is meant for a footer row or another layout that
 * already has its own structure. Use `Colophon` when the block itself is the
 * thing being placed.
 */
export function BuiltWithFoundations({ label = "Built with Foundations", className, }) {
    return (_jsxs(Button, { href: FOUNDATIONS_URL, variant: "outline", size: "sm", className: cn("group gap-2", className), children: [_jsx(FoundationsMark, { className: "size-3.5" }), label, _jsx(Arrow, {})] }));
}
/**
 * A preset built on top of `Bulletin`.
 *
 * ```tsx
 * <Colophon />                 // the panel
 * <Colophon variant="line" />  // the compact row
 * ```
 *
 * Use `BuiltWithFoundations` for the standalone link, and `Bulletin` if you
 * want the same layout with different copy.
 */
export function Colophon({ variant = "card", label, children, className, }) {
    const line = variant === "line";
    return (_jsx(Bulletin, { variant: variant, accent: _jsx(Ribbon, { className: line ? "h-1 min-w-20 flex-1 rounded-full" : "h-1.5 w-full" }), eyebrow: "Colophon", headline: HEADLINE, lede: line ? NOTE : LEDE, points: CLAIMS, action: _jsx(BuiltWithFoundations, { label: label }), footnote: FOOTNOTE, className: className, children: children }));
}

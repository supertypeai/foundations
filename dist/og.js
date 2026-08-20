import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Open Graph card dimensions. The 1.91:1 ratio every major network crops to. */
export const OG_SIZE = { width: 1200, height: 630 };
/** Measured, not guessed: ~45 chars/line at 62px over three lines, two at 28px. */
const TITLE_MAX = 135;
const DESCRIPTION_MAX = 160;
/**
 * A tree, not an image, so the package never imports `next/og`. Rendered by
 * satori: no stylesheets, no classes, no default block layout — hence inline
 * styles and an explicit `display: flex` on everything. Text is truncated in JS
 * because `-webkit-line-clamp` needs a display mode that contradicts the flex.
 */
/** Truncates on a word boundary, so a cut title does not end mid-word. */
function truncate(text, max) {
    if (text.length <= max)
        return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
export function ogCard({ title, description, site, accent = "#b1976b", background = "#0c0a09", foreground = "#fafaf9", muted = "#a8a29e", }) {
    return (_jsxs("div", { style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background,
            padding: "72px",
            fontFamily: "sans-serif",
        }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "28px" }, children: [_jsx("div", { style: { display: "flex", width: "88px", height: "6px", background: accent } }), _jsx("div", { style: {
                            display: "flex",
                            fontSize: 62,
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            color: foreground,
                        }, children: truncate(title, TITLE_MAX) }), description ? (_jsx("div", { style: {
                            display: "flex",
                            fontSize: 28,
                            lineHeight: 1.4,
                            color: muted,
                        }, children: truncate(description, DESCRIPTION_MAX) })) : null] }), site ? (_jsx("div", { style: {
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: accent,
                }, children: site })) : null] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { TypographyLabel, TypographyMuted, } from "../typography/paragraph.js";
/**
 * A numbered sequence: an `<ol>`, so a screen reader counts the steps and says
 * how many are left. The digits on the page are a CSS counter rather than
 * markup — reordering renumbers itself, and the numerals stay out of the
 * accessibility tree and out of copied text, since the list already carries the
 * count and hearing it twice is worse than not seeing it once.
 *
 * `tone` inks the numerals and nothing else, the contract `TabsList` and
 * `DisclosureGroup` both state: the rail is a hairline like every other rule in
 * the package, and the copy stays on the page's ink ladder.
 */
export function Steps({ className, children, tone = "primary", ...props }) {
    return (_jsx("ol", { className: cn(toneClass(tone), 
        // `list-none` restates preflight, for a consumer whose prose styles reach
        // `ol` — a marker beside the counter would number every step twice.
        "my-6 list-none [counter-reset:prose-step]", className), ...props, children: children }));
}
/**
 * One step: a numeral, the spine, and the copy, at 0, 28 and 40px.
 *
 * The numeral sits in its own gutter rather than on the rail. Centring it there
 * meant covering the hairline with a plate in the page's colour, which is a
 * component asserting what surface it is on — the one thing `--ink` and
 * `INK_ON_CARD` exist to stop it doing, and a visible chip the moment a step
 * list lands inside a card. Out here the rule runs unbroken and nothing has to
 * know the background. It is also the better setting: right-aligned and
 * `tabular-nums`, so 9 to 10 moves the digits and not the spine.
 *
 * The rail is a pseudo-element rather than a left border, so the last step drops
 * it outright instead of painting it transparent and paying for the pixel.
 *
 * Title and body are the type ladder's own rungs, not two hand-set copies of
 * them: both read `--ink`/`--ink-muted`, so a step list on a card takes the
 * card's ink the way everything else in the package does.
 */
export function Step({ title, className, children, ...props }) {
    return (_jsxs("li", { className: cn("relative pb-8 pl-10 last:pb-0 [counter-increment:prose-step]", 
        // The numeral. `h-5` is the label's line box, so it sets on the title's
        // line rather than above it.
        "before:absolute before:left-0 before:top-0 before:flex before:h-5 before:w-5", "before:items-center before:justify-end before:text-2xs before:font-medium", "before:tabular-nums before:text-(color:--tone-hue)", "before:[content:counter(prose-step)]", 
        // The spine, between the numeral and the copy. It connects one step to
        // the next, so there is nothing for it to do under the last.
        "after:absolute after:inset-y-0 after:left-7 after:w-px after:bg-border", "last:after:hidden", className), ...props, children: [title ? (_jsx(TypographyLabel, { as: "div", className: "mb-1", children: title })) : null, _jsx(TypographyMuted, { as: "div", children: children })] }));
}

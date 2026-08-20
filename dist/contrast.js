/**
 * Legibility measured against the cascade, not the declarations: reading `:root`
 * and `.dark` separately measures an intention, and ssite shipped a `.dark` at a
 * healthy 15.7:1 while the page rendered white on white. Build-time only.
 */
/**
 * Specificity over what token blocks use. `:root` and `.dark` both score 1 —
 * the tie above. `:not(…)` contributes its argument's score, per spec.
 */
export function specificity(selector) {
    const ids = selector.match(/#[\w-]+/g)?.length ?? 0;
    const notArgs = [...selector.matchAll(/:not\(([^)]*)\)/g)].map((m) => m[1]);
    const bare = selector.replace(/:not\([^)]*\)/g, "");
    const classes = bare.match(/\.[\w-]+/g)?.length ?? 0;
    const pseudos = bare.match(/(?<!:):[\w-]+/g)?.length ?? 0;
    const inner = notArgs.reduce((sum, arg) => sum + specificity(arg), 0);
    return ids * 100 + classes + pseudos + inner;
}
/** Whether a selector applies to the document root in the given theme. */
function matches(selector, theme) {
    const trimmed = selector.trim();
    // Only rules targeting the root element itself carry the token palette; a
    // descendant selector (`.dark .notes-route`) styles something else.
    if (/[\s>+~]/.test(trimmed))
        return false;
    if (!/^(:root|html|\.dark)/.test(trimmed))
        return false;
    const hasDark = /(^|[^(])\.dark\b/.test(trimmed.replace(/:not\([^)]*\)/g, ""));
    const excludesDark = [...trimmed.matchAll(/:not\(([^)]*)\)/g)].some((m) => m[1].includes(".dark"));
    if (theme === "dark")
        return !excludesDark;
    return !hasDark;
}
/** Properties surviving the cascade on :root. `css` is concatenated in import order. */
export function resolveTokens(css, theme) {
    const declarations = [];
    let order = 0;
    // Comments are stripped first. A selector is read back to the previous `}`,
    // so a comment sitting above one becomes part of it and the rule is silently
    // skipped — which is how a stylesheet that documents its overrides gets less
    // checking than one that does not.
    const source0 = css.replace(/\/\*[\s\S]*?\*\//g, "");
    // Walk the text, tracking whether the current block sits inside `@layer`.
    const walk = (source, layered) => {
        for (let i = 0; i < source.length; i++) {
            if (source[i] !== "{")
                continue;
            const head = source.slice(0, i);
            const selector = head.slice(head.lastIndexOf("}") + 1).trim();
            let depth = 0;
            let end = i;
            for (let j = i; j < source.length; j++) {
                if (source[j] === "{")
                    depth++;
                else if (source[j] === "}" && --depth === 0) {
                    end = j;
                    break;
                }
            }
            const body = source.slice(i + 1, end);
            if (selector.startsWith("@layer") || selector.startsWith("@media")) {
                walk(body, layered || selector.startsWith("@layer"));
            }
            else if (selector.startsWith("@")) {
                // @theme, @custom-variant and friends declare no root palette.
            }
            else if (matches(selector, theme)) {
                for (const [, property, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
                    declarations.push({
                        property,
                        value: value.trim(),
                        layered,
                        specificity: specificity(selector),
                        order: order++,
                    });
                }
            }
            // Skip past the block just consumed.
            i = end;
        }
    };
    walk(source0, false);
    const winners = {};
    for (const decl of declarations) {
        const held = winners[decl.property];
        if (!held || outranks(decl, held))
            winners[decl.property] = decl;
    }
    return Object.fromEntries(Object.entries(winners).map(([property, decl]) => [property, decl.value]));
}
function outranks(next, held) {
    if (next.layered !== held.layered)
        return !next.layered;
    if (next.specificity !== held.specificity)
        return next.specificity > held.specificity;
    return next.order > held.order;
}
/** Parses `hsl(...)`, `#rgb`, `#rrggbb` and `rgb(...)`. Returns null otherwise. */
export function parseColor(value) {
    const input = value.trim();
    const hsl = input.match(/hsla?\(\s*([\d.]+)(?:deg)?\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%/i);
    if (hsl) {
        const [h, s, l] = [+hsl[1], +hsl[2] / 100, +hsl[3] / 100];
        const a = s * Math.min(l, 1 - l);
        const f = (n) => {
            const k = (n + h / 30) % 12;
            return (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))) * 255;
        };
        return [f(0), f(8), f(4)];
    }
    const hex = input.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
        const digits = hex[1].length === 3
            ? [...hex[1]].map((d) => d + d).join("")
            : hex[1];
        return [
            parseInt(digits.slice(0, 2), 16),
            parseInt(digits.slice(2, 4), 16),
            parseInt(digits.slice(4, 6), 16),
        ];
    }
    const rgb = input.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (rgb)
        return [+rgb[1], +rgb[2], +rgb[3]];
    return null;
}
/** WCAG relative luminance. */
export function luminance([r, g, b]) {
    const [rl, gl, bl] = [r, g, b].map((channel) => {
        const s = channel / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
/** WCAG contrast ratio, 1:1 to 21:1. */
export function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}
const INKS = ["--foreground", "--muted-foreground", "--card-foreground"];
const SURFACES = ["--background", "--card", "--muted"];
/**
 * Every ink on every surface, both themes. Missing or non-literal tokens are
 * skipped — a default or an aliased variable is not a contrast failure.
 */
export function checkLegibility(css, { minimum = 4.5, inks = INKS, surfaces = SURFACES, themes = ["light", "dark"], } = {}) {
    const failures = [];
    for (const theme of themes) {
        const tokens = resolveTokens(css, theme);
        for (const ink of inks) {
            const inkColor = parseColor(tokens[ink] ?? "");
            if (!inkColor)
                continue;
            for (const surface of surfaces) {
                const surfaceColor = parseColor(tokens[surface] ?? "");
                if (!surfaceColor)
                    continue;
                const ratio = contrast(inkColor, surfaceColor);
                if (ratio < minimum)
                    failures.push({ theme, ink, surface, ratio, required: minimum });
            }
        }
    }
    return failures;
}
/** A one-line report per failure, for a test's assertion message. */
export function formatFailures(failures) {
    return failures
        .map((f) => `${f.theme}: ${f.ink} on ${f.surface} is ${f.ratio.toFixed(2)}:1, below ${f.required}:1`)
        .join("\n");
}

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
    // A statement at-rule (`@import`, `@source`, `@custom-variant`, `@apply`) ends
    // in a semicolon, and a selector is read back to the previous `}` — so leaving
    // one in makes the block that follows it look like an at-rule and be skipped.
    const source0 = css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[;{}])\s*@[\w-]+[^;{}]*;/g, "$1");
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
    const resolved = Object.fromEntries(Object.entries(winners).map(([property, decl]) => [property, decl.value]));
    // `--input: var(--border)` is an alias, not an unreadable value. Follow the
    // whole-value form so a check measures what the browser paints; a fallback or
    // an embedded var() stays unresolved, which the callers already skip.
    const ALIAS = /^var\(\s*(--[\w-]+)\s*\)$/;
    for (const property of Object.keys(resolved)) {
        const seen = new Set([property]);
        let match;
        while ((match = ALIAS.exec(resolved[property]))) {
            const target = match[1];
            if (seen.has(target) || resolved[target] === undefined)
                break;
            seen.add(target);
            resolved[property] = resolved[target];
        }
    }
    return resolved;
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
        const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join("") : hex[1];
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
/**
 * APCA lightness contrast (Lc), the perceptual measure WCAG 3 is built on.
 *
 * It sits beside `contrast` because the two answer different questions and an
 * ink ramp needs both. A WCAG ratio is polarity-blind: it reports the same
 * number whether the text is dark on light or light on dark, when in fact dark
 * glyphs on a bright field thin out and light glyphs on a dark field bloat. That
 * blindness is what lets a ramp be ordered by ratio and still read flat — viably
 * shipped a `--muted-foreground` measuring 72.5 Lc in light and 52.1 in dark,
 * the same verdict from `contrast` on both sides and twenty points apart to a
 * reader.
 *
 * Lc also states the term a ratio cannot: legibility is contrast times size, so
 * a floor here is what says an ink comfortable at 16px is or is not comfortable
 * on the 13px rung a dense product actually spends.
 *
 * Returned absolute. It is signed by polarity in the specification, and every
 * caller so far asks "is this legible", never "which way round is it".
 */
export function lc(text, background) {
    // Screen luminance on APCA's own curve, which is not WCAG's: exponent 2.4 on
    // the raw channel, with weights of its own.
    const y = ([r, g, b]) => {
        const v = 0.2126729 * (r / 255) ** 2.4 +
            0.7151522 * (g / 255) ** 2.4 +
            0.072175 * (b / 255) ** 2.4;
        // Soft clamp near black, where the power curve stops modelling perception.
        return v < 0.022 ? v + (0.022 - v) ** 1.414 : v;
    };
    const [yText, yBackground] = [y(text), y(background)];
    // Two exponent pairs, one per polarity. This asymmetry is the whole reason Lc
    // says something a ratio cannot.
    const s = yBackground > yText
        ? (yBackground ** 0.56 - yText ** 0.57) * 1.14
        : (yBackground ** 0.65 - yText ** 0.62) * 1.14;
    // Below the noise floor the two are the same colour as far as a reader is
    // concerned, and the offset below would report a spurious 2.7.
    if (Math.abs(s) < 0.1)
        return 0;
    return Math.abs(s > 0 ? (s - 0.027) * 100 : (s + 0.027) * 100);
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
/**
 * Marks rather than words: status and categorical fills, which carry meaning as
 * an 8px dot or a 2px bar. WCAG 1.4.11 asks 3:1 of them, not 4.5:1.
 */
const FILLS = [
    "--success",
    "--warn",
    "--info",
    "--terracotta",
    "--ochre",
    "--moss",
    "--fern",
    "--sage",
    "--stone",
    "--fig",
    "--cocoa",
    // A chart series is a mark like any other, and docs/cli.md has always said so
    // ("a status dot or a chart bar that cannot be picked out of its background").
    // Leaving them out of this list is how the sand shipped at 2.18:1 in light and
    // the taupe at 2.26:1 in dark: a promise in prose that nothing measured.
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
    "--chart-6",
];
/**
 * A fill has to separate from the page and from a card. Not from `--muted`: a
 * wash of the hue is where its ink goes, and the fills sit at 2.7:1 there by
 * design.
 */
const FILL_SURFACES = ["--background", "--card"];
/** The same hues as words, at the bar body copy is held to. */
const INKS_TINTED = [
    "--primary-ink",
    "--success-ink",
    "--warn-ink",
    "--info-ink",
    "--danger",
    "--secondary-ink",
    "--terracotta-ink",
    "--ochre-ink",
    "--moss-ink",
    "--fern-ink",
    "--sage-ink",
    "--stone-ink",
    "--fig-ink",
    "--cocoa-ink",
];
/**
 * The tertiary ink, at the 3:1 its own comment in theme.css claims for it —
 * placeholders and disabled labels, never anything load-bearing. Held here
 * rather than in `INKS` because 4.5:1 would fail a token that is correct; held
 * *somewhere* because the sentence stating the bar was the only thing enforcing
 * it, and light sits at 3.14:1 on --muted with nothing watching the gap.
 */
const TERTIARY = ["--subtle-foreground"];
/**
 * shadcn's shape: `-foreground` is the label printed on the fill, so the pair is
 * measured against itself rather than against the page.
 *
 * `--success` and `--warn` joined the list when the tone table stopped making
 * exceptions of them. A filled status control is a real thing, `Button
 * tone="warn" variant="solid"` renders one, and white on amber measured 2.44:1
 * on the dark theme for as long as the pair went unnamed here.
 */
const ON_FILL = [
    ["--primary", "--primary-foreground"],
    ["--secondary", "--secondary-foreground"],
    ["--destructive", "--destructive-foreground"],
    ["--success", "--success-foreground"],
    ["--warn", "--warn-foreground"],
    ["--accent", "--accent-foreground"],
    ["--card", "--card-foreground"],
    ["--popover", "--popover-foreground"],
    ["--sidebar", "--sidebar-foreground"],
];
/**
 * The cuts a token ships, read off the same three sets `checkSignals` measures.
 *
 * Exported because the alternative is every consumer keeping its own idea of
 * which tokens are pairs — the docs site did, and got the categorical hues
 * wrong, rendering `--ochre` as a lone square while its ink, the colour the
 * marker highlight is painted with, appeared nowhere. A palette checked against
 * one taxonomy and documented from another will drift, and the drift shows up as
 * a page that is quietly wrong rather than a build that fails.
 */
export function tokenCuts(token) {
    const fill = token.startsWith("--") ? token : `--${token}`;
    return {
        fill,
        onFill: ON_FILL.find(([surface]) => surface === fill)?.[1],
        asInk: INKS_TINTED.find((ink) => ink === `${fill}-ink`),
    };
}
/**
 * A hairline is neither ink nor a mark, so neither bar fits: WCAG exempts a
 * decorative rule outright, and holding one to 3:1 would draw a box, not a
 * border. What it owes is symmetry — the same rule has to read as the same
 * weight in both themes, and it did not: the dark hairline was tuned by hand
 * (L22's 1.34:1 on --card was rejected as too faint) while the light one was
 * never measured at all and shipped under the value dark had turned down.
 *
 * 1.4:1 is that floor, set just under the pair the themes now agree on. Only
 * --background and --card: a rule inside a `muted` well sits on a surface that
 * is itself a wash, and 1.3:1 is the practical floor for that kind of well.
 */
const HAIRLINES = ["--border", "--input"];
const HAIRLINE_SURFACES = ["--background", "--card"];
/**
 * The sidebar keeps its own pair, because a rule there is drawn on `--sidebar`
 * and never on the page. Measuring it against `--background` would fail a border
 * that is correct and pass one that is not.
 */
const SIDEBAR_HAIRLINE = [
    "--sidebar-border",
    "--sidebar",
];
/**
 * The bar a rule owes, held apart from `checkSignals` because it is not a
 * signal: nothing here carries meaning in its hue, it only has to be seen.
 */
export function checkHairlines(css, { themes = ["light", "dark"] } = {}) {
    return [
        ...checkLegibility(css, {
            inks: HAIRLINES,
            surfaces: HAIRLINE_SURFACES,
            minimum: 1.4,
            themes,
        }),
        ...checkLegibility(css, {
            inks: [SIDEBAR_HAIRLINE[0]],
            surfaces: [SIDEBAR_HAIRLINE[1]],
            minimum: 1.4,
            themes,
        }),
    ];
}
/**
 * The three bars a palette owes, run over the same engine as `checkLegibility`.
 * Without this the numbers in a theme's comments are claims, not measurements.
 */
export function checkSignals(css, { themes = ["light", "dark"] } = {}) {
    return [
        ...checkLegibility(css, {
            inks: FILLS,
            surfaces: FILL_SURFACES,
            minimum: 3,
            themes,
        }),
        ...checkLegibility(css, { inks: INKS_TINTED, themes }),
        ...checkLegibility(css, { inks: TERTIARY, minimum: 3, themes }),
        ...ON_FILL.flatMap(([fill, label]) => checkLegibility(css, { inks: [label], surfaces: [fill], themes })),
    ];
}
/** A one-line report per failure, for a test's assertion message. */
export function formatFailures(failures) {
    return failures
        .map((f) => `${f.theme}: ${f.ink} on ${f.surface} is ${f.ratio.toFixed(2)}:1, below ${f.required}:1`)
        .join("\n");
}

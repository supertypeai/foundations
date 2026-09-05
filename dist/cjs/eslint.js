"use strict";
/**
 * The design rules, as ESLint selectors, shared so the two apps cannot drift.
 * Plain data — esquery matches these against className strings, so no plugin.
 * They see values, never the shape of a class list; a primitive fixes that.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.designRules = designRules;
/** A className written as a plain string, or as a chunk of a template literal. */
const classString = (pattern) => [
    `Literal[value=${pattern}]`,
    `TemplateElement[value.raw=${pattern}]`,
];
const rule = (pattern, message) => classString(pattern).map((selector) => ({ selector, message }));
const VARIANTS = "(dark:|hover:|focus:|group-hover:|active:|disabled:|sm:|md:|lg:|xl:)*";
const PALETTE = "(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";
/** Every utility that takes a colour, named once. Written out per rule, the
 *  palette rule covered gradient stops and the hex rule beside it did not. */
const COLOUR_UTIL = "text|bg|border|ring|from|to|via|fill|stroke|divide|outline|placeholder|shadow|decoration|accent|caret";
/** Applies everywhere, marketing included — the tints exist for those pages. */
function colourRules({ accents = "a brand accent", inlineStyle = false, } = {}) {
    return [
        ...rule(`/(^| )${VARIANTS}(${COLOUR_UTIL})-${PALETTE}-\\d+/`, `Raw Tailwind palette. Use a token — text-foreground / text-muted-foreground / text-subtle-foreground, bg-background / bg-card / bg-muted, border-border — a status token (success, warn, destructive), or ${accents}.`),
        // Split by prefix: alpha on a fill is a scrim (the effect), on ink or a
        // hairline it is just an undeclared colour.
        ...rule(`/(^| )${VARIANTS}(bg|from|to|via|shadow)-(white|black)($| )/`, "Solid white/black is a hand-rolled surface. Use bg-card / bg-background, or bg-tint for a tinted panel. Alpha scrims (bg-black/50) stay legal — there the point is the transparency, not the hue."),
        ...rule(`/(^| )${VARIANTS}(text|border|ring|divide|fill|stroke|decoration|outline|placeholder)-(white|black)($| |\\x2f)/`, "White/black ink and hairlines are hand-rolled colour, alpha or not. Use text-foreground / text-background for ink, text-tint-foreground for ink on a tinted surface, and border-border for a hairline — the token already carries the alpha the theme wants."),
        // Every colour utility and variant, matching the palette rule above.
        ...rule(`/(^| )${VARIANTS}(${COLOUR_UTIL})-\\[#/`, "Hex colours bypass the token system entirely, gradient stops included. Add a token if the colour is real; use an existing one if it is not."),
        // The blind spot in the rules above, which all read classNames.
        // `var(--token)` stays legal: that is what `inkOnSurfaceStyle` returns.
        ...(inlineStyle
            ? [
                {
                    selector: 'JSXAttribute[name.name="style"] Literal[value=/#[0-9a-fA-F]{3,8}/]',
                    message: "A literal colour in a style object. Every colour rule reads classNames, so nothing else here can see this one. Use a token class, or `var(--token)` in the style object when a class cannot carry it. An OG card is the exception, since next/og resolves no custom properties.",
                },
            ]
            : []),
    ];
}
/**
 * The semantic tokens, for the rules that care which token it is rather than
 * whether one was used at all.
 */
const TOKEN = "foreground|muted-foreground|subtle-foreground|muted|card-foreground|card|popover-foreground|popover|" +
    "secondary-foreground|secondary|accent-foreground|accent|primary-foreground|primary|border|input|ring|" +
    "background|destructive-foreground|destructive|success|warn|info|brand|tint-foreground";
const COLOUR_PREFIX = "text|bg|border|ring|from|to|via|fill|stroke|divide|placeholder|decoration|shadow|outline";
/**
 * A token already knows what it does in the dark; `dark:` on one says the token
 * is wrong. Only the solid form is restricted — `dark:bg-destructive/20` against
 * a `/10` is the same token at the density a darker ground needs.
 */
function themeOverrideRules() {
    return rule(`/(^| )dark:(${COLOUR_PREFIX})-(${TOKEN})($| )/`, "A `dark:` override on a token means the token is wrong — fix it in theme.css, where one change covers every call site, rather than here. Alpha variants (dark:bg-destructive/20) stay legal: those tune a wash's density, not the token.");
}
/**
 * `--muted` is a fill at L92%, so `text-muted` lands at ~1.1:1. Invisible, and
 * it shipped at 17 sites. `text-background` stays legal: inverse ink is a real
 * role.
 */
function surfaceAsInkRules() {
    return [
        ...rule("/(^| )(dark:|hover:|focus:|group-hover:)*text-(muted|card|popover|input)($| )/", "That is a surface token, not an ink — as text it has no defined contrast (text-muted measures ~1.1:1 on a light page). Use text-muted-foreground for secondary ink, text-subtle-foreground for tertiary, or text-card-foreground on a card."),
        // Three fills that read under the tertiary ink in dark (2.77:1, 3.36:1,
        // 3.79:1, against 6.75:1). `warn` and `info` stay out, bright enough to read.
        ...rule("/(^| )(dark:|hover:|focus:|group-hover:)*text-(primary|secondary|success)($| )/", "That is a fill token used as ink. A fill's lightness is chosen to hold a label printed on it, so against the page it reads under the tertiary ink in dark (primary 3.36:1, secondary 2.77:1, success 3.79:1). Each ships an `-ink` cut checked at 4.5:1 against the page. Add `-ink`."),
    ];
}
/** `-foreground` is the label printed on a fill, `-ink` the hue as words. The old
 *  spellings still resolve, so only this stops them surviving the rename. */
const RENAMED_INKS = "terracotta|ochre|moss|fern|sage|stone|fig|cocoa";
function renamedTokenRules() {
    return rule(`/(^| )(dark:|hover:|focus:|group-hover:)*(text|bg|border|ring|fill|stroke|decoration)-(${RENAMED_INKS})-foreground($| )/`, "That is the deprecated name for the same hue's `-ink`. In this package `-foreground` is the label printed on a fill and `-ink` is the hue used as words, and none of these hues has a printed-on label — they are checked at 4.5:1 against the page, and printing one on its own fill measures about 1.2:1. Use `-ink`.");
}
/**
 * `render={<a href>}` on a component that takes `href`. The cloned anchor skips
 * the router and gets no `rel` off-site. Narrow deliberately: `RailLink` takes a
 * router element through `render`, and `render={<Link/>}` still routes.
 */
function linkRules() {
    return [
        {
            selector: 'JSXOpeningElement[name.name=/^(Button|Badge|Card)$/] > JSXAttribute[name.name="render"] > JSXExpressionContainer > JSXElement > JSXOpeningElement[name.name="a"]',
            message: "Pass `href` instead of rendering an anchor. A cloned <a> bypasses the router (full page load, no view transition) and gets no rel on an off-site href; `href` routes through the package's one rule. `render` is for an element that is not a link.",
        },
    ];
}
function typographyRules({ weights = false, ramp = "text-3xs 10 / text-2xs 11 / text-xs 12 / text-sm 14 / text-base 16 and up", pairing = false, axis = false, leading = false, } = {}) {
    return [
        // Alpha ink composites against whatever surface it lands on, so its
        // contrast is unmeasurable. The ink tokens are measured.
        // `\x2f`, never a literal slash: ESLint 8's esquery ends the regex at the
        // first `/` it sees, however escaped, and hands RegExp the truncated half.
        ...rule("/text-(foreground|muted-foreground|subtle-foreground)\\x2f\\d+/", "Alpha on a text token has unmeasurable contrast (it composites against whatever surface it lands on). Use text-foreground (primary), text-muted-foreground (secondary), or text-subtle-foreground (tertiary)."),
        // Any unit, not px alone: an ornament in rem is still a size nothing else can
        // reach for. Digits then a unit, so `text-[color:var(--ink)]` is untouched.
        ...rule(`/(^| )${VARIANTS}text-\\[[\\d.]+(px|rem|em|pt|ch|vw|vh|vmin|vmax)\\]/`, `Arbitrary font sizes bypass the type ramp. Use a rung (${ramp}).`),
        // Rule 1 of llms.txt, which had no rule behind it. Every value can be fine
        // and the primitive still skipped: `text-sm text-muted-foreground` on a
        // paragraph is `TypographyMuted`. Only `<p>` and headings, which are text by
        // definition; a `<span>` with a rung measured 166 hits to this one's ten.
        ...["Literal[value", "TemplateElement[value.raw"].map((node) => ({
            selector: `JSXOpeningElement[name.name=/^(p|h1|h2|h3|h4|h5|h6)$/] JSXAttribute[name.name="className"] ${node}=/(^| )(text-(3xs|2xs|xs|sm|base|lg|xl|[2-9]xl)|text-(muted|subtle)-foreground|font-(medium|semibold|bold)|leading-(none|tight|snug|relaxed|loose))( |$)/]`,
            message: `A type style written by hand on a text element. There is a primitive for it: TypographyP or TypographyMuted for copy, TypographyH1-H4 for a heading, TypographyEyebrow for a kicker, TypographyCaption or TypographyLabel for a value and its key. The class sets the size and drops the ink variable and the leading that come with the rung (${ramp}).`,
        })),
        // A primitive that owns a size axis, reached past for a class. The class wins
        // and drops the ladder the axis carries. Matching inside the attribute names
        // the component, and reaches into `cn()` for free.
        ...(axis
            ? [
                // Both node kinds: a conditional class list is where a stray rung hides.
                ...["Literal[value", "TemplateElement[value.raw"].map((node) => ({
                    selector: `JSXOpeningElement[name.name=/^Typography(Small|Caption|Stat|Eyebrow)$/] JSXAttribute[name.name="className"] ${node}=/(^| )text-(3xs|2xs|xs|sm|base|lg|xl|[2-9]xl|h[1-4])( |$)/]`,
                    message: "This primitive owns its size: pass the axis (TypographySmall/Caption size=, TypographyStat size=, TypographyEyebrow tone=) rather than a text-* class, which takes the size and drops the leading and ladder that come with the rung.",
                })),
            ]
            : []),
        // Leading stated at a call site, on a primitive whose rung already carries
        // one. A class pins past the ramp and reports nothing when it stops fitting.
        ...(leading
            ? [
                ...["Literal[value", "TemplateElement[value.raw"].map((node) => ({
                    selector: `JSXOpeningElement[name.name=/^Typography[A-Z]/] JSXAttribute[name.name="className"] ${node}=/(^| )leading-/]`,
                    message: "Leading comes from the rung, which is what an app retunes. Move the rung (size=), or state it on the primitive if every call site wants it.",
                })),
            ]
            : []),
        // Two valid primitives forming an invalid pair: one passage, two rungs.
        // `~` and never `+`, which will not cross the whitespace node JSX puts
        // between siblings. On 168 files it fired four times and was right four times.
        ...(pairing
            ? [
                {
                    selector: 'JSXElement:has(>JSXOpeningElement[name.name="TypographyP"]) ~ JSXElement > JSXOpeningElement[name.name="TypographyProseList"]',
                    message: 'A ui paragraph over a prose list splits one passage across two rungs. Promote the paragraph with TypographyProse, or drop the list to the paragraph\'s rung with TypographyList variant="ui".',
                },
            ]
            : []),
        ...(weights
            ? rule("/(^| )font-(bold|extrabold|black)( |$)/", "The product weight ramp is 400 body / 500 label / 600 heading. Use font-semibold for headings, or a label primitive for a label.")
            : []),
    ];
}
/**
 * A `size-` class on a mark inside a control that sizes its own. `Button` and
 * `TabsTrigger` beat it with a descendant selector, so the class is inert. The
 * second `JSXElement` step is what keeps this off the control's own box.
 */
function markSizeRules() {
    return [
        {
            selector: 'JSXElement[openingElement.name.name=/^(Button|TabsTrigger)$/] JSXElement JSXAttribute[name.name="className"] Literal[value=/(^| )size-[\\d.]+($| )/]',
            message: "Button and TabsTrigger size their own icons off the text rung, so this class is inert. Remove the size- token. A control that genuinely needs a bigger mark says so on the control: className=\"[&_svg]:size-5\".",
        },
    ];
}
/**
 * A vertical margin holding a mark into line with the words beside it. The pixel
 * fits one pairing of mark size and rung and misses every other; one consumer
 * carried 84 across 27 files. `inline(?![-\w])` keeps `inline-flex` out, where a
 * top margin is ordinary spacing.
 */
const INLINE = "inline(?![-\\w])";
const MARGIN_TOP = "-?mt-[\\d.]+(?![\\w-])";
function markAlignRules() {
    return rule(`/(^| )${MARGIN_TOP}[^\\n]*${INLINE}|${INLINE}[^\\n]*(^| )${MARGIN_TOP}/`, "A vertical margin on an inline mark is a nudge that fits one rung and no other. Use `align-middle` for a mark inside a run of words, `ON_FIRST_LINE` for a mark beside a block of text, and `CAP_TRIM` on the text of a single-line row.");
}
function designRules({ accents, inlineStyle, typography = true, ...type } = {}) {
    return [
        ...colourRules({ accents, inlineStyle }),
        ...(typography ? typographyRules(type) : []),
        ...linkRules(),
        ...themeOverrideRules(),
        ...surfaceAsInkRules(),
        ...renamedTokenRules(),
        ...markSizeRules(),
        ...markAlignRules(),
    ];
}

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
/** Applies everywhere, marketing included — the tints exist for those pages. */
function colourRules({ accents = "a brand accent", } = {}) {
    return [
        ...rule(`/(^| )${VARIANTS}(text|bg|border|ring|from|to|via|fill|stroke|divide|outline|placeholder|shadow|decoration|accent|caret)-${PALETTE}-\\d+/`, `Raw Tailwind palette. Use a token — text-foreground / text-muted-foreground / text-subtle-foreground, bg-background / bg-card / bg-muted, border-border — a status token (success, warn, destructive), or ${accents}.`),
        // Split by prefix: alpha on a fill is a scrim (the effect), on ink or a
        // hairline it is just an undeclared colour.
        ...rule(`/(^| )${VARIANTS}(bg|from|to|via|shadow)-(white|black)($| )/`, "Solid white/black is a hand-rolled surface. Use bg-card / bg-background, or bg-tint for a tinted panel. Alpha scrims (bg-black/50) stay legal — there the point is the transparency, not the hue."),
        ...rule(`/(^| )${VARIANTS}(text|border|ring|divide|fill|stroke|decoration|outline|placeholder)-(white|black)($| |\\x2f)/`, "White/black ink and hairlines are hand-rolled colour, alpha or not. Use text-foreground / text-background for ink, text-tint-foreground for ink on a tinted surface, and border-border for a hairline — the token already carries the alpha the theme wants."),
        ...rule("/(^| )(text|bg|border|fill|stroke|ring)-\\[#/", "Hex colours bypass the token system entirely. Add a token if the colour is real; use an existing one if it is not."),
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
        // The three fills with no legitimate use as a foreground, glyph or word.
        // Each is a background whose lightness is chosen to hold a label, so read as
        // ink against the page it lands under the tertiary rung: in dark, secondary
        // measures 2.77:1, primary 3.36:1 and success 3.79:1, where
        // `--subtle-foreground` is 6.75:1. An accent quieter than the quietest ink is
        // the bug, and it reads the same way on an icon as it does in a sentence.
        //
        // Unconditional, unlike the opt-in rules above, because the sweep is done in
        // both apps and there is no correct call site left to grandfather. `warn` and
        // `info` stay out: their fills are bright enough to read (7.68:1 and 6.10:1).
        ...rule("/(^| )(dark:|hover:|focus:|group-hover:)*text-(primary|secondary|success)($| )/", "That is a fill token used as ink. A fill's lightness is chosen to hold a label printed on it, so against the page it reads under the tertiary ink in dark (primary 3.36:1, secondary 2.77:1, success 3.79:1). Each ships an `-ink` cut checked at 4.5:1 against the page. Add `-ink`."),
    ];
}
/**
 * `-foreground` means the label printed on a fill; `-ink` means the hue as
 * words. The eight categorical `-foreground` tokens were always inks, under the
 * other name. The old spellings still resolve, so nothing breaks on the day of
 * the rename; this is what stops them surviving it.
 *
 * `warn` left this list when the status tones gained real on-fill labels:
 * `--warn-foreground` now means what its name says, the ink printed on the warn
 * fill, and `Button tone="warn" variant="solid"` is what reads it.
 */
const RENAMED_INKS = "terracotta|ochre|moss|fern|sage|stone|fig|cocoa";
function renamedTokenRules() {
    return rule(`/(^| )(dark:|hover:|focus:|group-hover:)*(text|bg|border|ring|fill|stroke|decoration)-(${RENAMED_INKS})-foreground($| )/`, "That is the deprecated name for the same hue's `-ink`. In this package `-foreground` is the label printed on a fill and `-ink` is the hue used as words, and none of these hues has a printed-on label — they are checked at 4.5:1 against the page, and printing one on its own fill measures about 1.2:1. Use `-ink`.");
}
/**
 * `render={<a href="…" />}` on a component that takes an `href`. It reads as a
 * styling choice and is a routing one: the cloned anchor skips the router, so
 * the page fully reloads and the view transition is lost, and an off-site href
 * never grows a `rel`. Button, Badge and Card each decide internal vs external
 * from the href itself, so the anchor is never needed and cannot be right more
 * often than the one shared rule is.
 *
 * Narrow on both axes, so it never fires on a line that is correct. Only those
 * three components — `RailLink` deliberately takes a router element through
 * `render`, because its module has to stay importable without Next. And only a
 * bare `<a>`: `render={<Link/>}` is redundant beside `href` but it still routes,
 * so it is not a bug.
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
        // px only: a rem value at display scale is an ornament, not a rung.
        ...rule("/(^| )text-\\[\\d+px\\]/", `Arbitrary font sizes bypass the type ramp. Use a rung (${ramp}).`),
        // A primitive that owns a size axis, reached past for a class that does the
        // same thing. The class wins on the page, so nothing looks wrong — what is
        // lost is everything else the axis carries: `TypographyStat` pairs its rungs
        // with the heading ladder, so a figure and the heading beside it retune
        // together on an editorial surface, where a literal stays put. A literal
        // gets the size and silently drops the rest.
        //
        // Matching the class node INSIDE the attribute, rather than the className
        // string on its own, lets this name the component. It reaches into `cn()`
        // for free, since the argument sits in the same subtree.
        ...(axis
            ? [
                // Both node kinds, for the same reason `classString` above covers both: a
                // class list assembled in a template literal is the shape a call site
                // reaches for precisely when it is doing something conditional, which
                // is where a stray rung is most likely to be hiding.
                ...["Literal[value", "TemplateElement[value.raw"].map((node) => ({
                    selector: `JSXOpeningElement[name.name=/^Typography(Small|Caption|Stat|Eyebrow)$/] JSXAttribute[name.name="className"] ${node}=/(^| )text-(3xs|2xs|xs|sm|base|lg|xl|[2-9]xl|h[1-4])( |$)/]`,
                    message: "This primitive owns its size: pass the axis (TypographySmall/Caption size=, TypographyStat size=, TypographyEyebrow tone=) rather than a text-* class, which takes the size and drops the leading and ladder that come with the rung.",
                })),
            ]
            : []),
        // Leading stated at a call site, on a primitive whose rung already carries
        // one. The ramp is what an app retunes, and a class pins past it: the pinned
        // value follows the component onto a surface tuned for different sizes and
        // reports nothing when it no longer fits. Where a role genuinely needs a
        // number the rung cannot give, the reading paragraph and the value being the
        // two, the primitive states it and every call site inherits the decision.
        ...(leading
            ? [
                ...["Literal[value", "TemplateElement[value.raw"].map((node) => ({
                    selector: `JSXOpeningElement[name.name=/^Typography[A-Z]/] JSXAttribute[name.name="className"] ${node}=/(^| )leading-/]`,
                    message: "Leading comes from the rung, which is what an app retunes. Move the rung (size=), or state it on the primitive if every call site wants it.",
                })),
            ]
            : []),
        // Two valid primitives forming an invalid pair, which the value rules above
        // cannot see: `<TypographyP>` is the 14px interface rung, and the list under
        // it reads at the prose rung, so one passage lands two rungs apart.
        //
        // `~` and never `+`: JSX puts a whitespace text node between sibling
        // elements, and an adjacent-sibling selector will not cross it — measured,
        // `+` matches nothing at all here. The cost of `~` is that it means "any
        // later sibling", so it can reach past an intervening paragraph; on a corpus
        // of 168 files it fired four times and was right four times.
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
function designRules({ accents, typography = true, ...type } = {}) {
    return [
        ...colourRules({ accents }),
        ...(typography ? typographyRules(type) : []),
        ...linkRules(),
        ...themeOverrideRules(),
        ...surfaceAsInkRules(),
        ...renamedTokenRules(),
    ];
}

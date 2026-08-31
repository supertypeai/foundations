/**
 * The design rules, as ESLint selectors, shared so the two apps cannot drift.
 * Plain data — esquery matches these against className strings, so no plugin.
 * They see values, never the shape of a class list; a primitive fixes that.
 */

export interface RestrictedSyntax {
  selector: string;
  message: string;
}

/** A className written as a plain string, or as a chunk of a template literal. */
const classString = (pattern: string) => [
  `Literal[value=${pattern}]`,
  `TemplateElement[value.raw=${pattern}]`,
];

const rule = (pattern: string, message: string): RestrictedSyntax[] =>
  classString(pattern).map((selector) => ({ selector, message }));

const VARIANTS =
  "(dark:|hover:|focus:|group-hover:|active:|disabled:|sm:|md:|lg:|xl:)*";

const PALETTE =
  "(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";

export interface ColourOptions {
  /** Named in the message: "use a token" without naming one sends people hunting. */
  accents?: string;
}

/** Applies everywhere, marketing included — the tints exist for those pages. */
export function colourRules({
  accents = "a brand accent",
}: ColourOptions = {}): RestrictedSyntax[] {
  return [
    ...rule(
      `/(^| )${VARIANTS}(text|bg|border|ring|from|to|via|fill|stroke|divide|outline|placeholder|shadow|decoration|accent|caret)-${PALETTE}-\\d+/`,
      `Raw Tailwind palette. Use a token — text-foreground / text-muted-foreground / text-subtle-foreground, bg-background / bg-card / bg-muted, border-border — a status token (success, warn, destructive), or ${accents}.`,
    ),
    // Split by prefix: alpha on a fill is a scrim (the effect), on ink or a
    // hairline it is just an undeclared colour.
    ...rule(
      `/(^| )${VARIANTS}(bg|from|to|via|shadow)-(white|black)($| )/`,
      "Solid white/black is a hand-rolled surface. Use bg-card / bg-background, or bg-tint for a tinted panel. Alpha scrims (bg-black/50) stay legal — there the point is the transparency, not the hue.",
    ),
    ...rule(
      `/(^| )${VARIANTS}(text|border|ring|divide|fill|stroke|decoration|outline|placeholder)-(white|black)($| |\\x2f)/`,
      "White/black ink and hairlines are hand-rolled colour, alpha or not. Use text-foreground / text-background for ink, text-tint-foreground for ink on a tinted surface, and border-border for a hairline — the token already carries the alpha the theme wants.",
    ),
    ...rule(
      "/(^| )(text|bg|border|fill|stroke|ring)-\\[#/",
      "Hex colours bypass the token system entirely. Add a token if the colour is real; use an existing one if it is not.",
    ),
  ];
}

/**
 * The semantic tokens, for the rules that care which token it is rather than
 * whether one was used at all.
 */
const TOKEN =
  "foreground|muted-foreground|subtle-foreground|muted|card-foreground|card|popover-foreground|popover|" +
  "secondary-foreground|secondary|accent-foreground|accent|primary-foreground|primary|border|input|ring|" +
  "background|destructive-foreground|destructive|success|warn|info|brand|tint-foreground";

const COLOUR_PREFIX =
  "text|bg|border|ring|from|to|via|fill|stroke|divide|placeholder|decoration|shadow|outline";

/**
 * A token already knows what it does in the dark; `dark:` on one says the token
 * is wrong. Only the solid form is restricted — `dark:bg-destructive/20` against
 * a `/10` is the same token at the density a darker ground needs.
 */
export function themeOverrideRules(): RestrictedSyntax[] {
  return rule(
    `/(^| )dark:(${COLOUR_PREFIX})-(${TOKEN})($| )/`,
    "A `dark:` override on a token means the token is wrong — fix it in theme.css, where one change covers every call site, rather than here. Alpha variants (dark:bg-destructive/20) stay legal: those tune a wash's density, not the token.",
  );
}

/**
 * `--muted` is a fill at L92%, so `text-muted` lands at ~1.1:1. Invisible, and
 * it shipped at 17 sites. `text-background` stays legal: inverse ink is a real
 * role.
 */
export function surfaceAsInkRules(): RestrictedSyntax[] {
  return rule(
    "/(^| )(dark:|hover:|focus:|group-hover:)*text-(muted|card|popover|input)($| )/",
    "That is a surface token, not an ink — as text it has no defined contrast (text-muted measures ~1.1:1 on a light page). Use text-muted-foreground for secondary ink, text-subtle-foreground for tertiary, or text-card-foreground on a card.",
  );
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

export function renamedTokenRules(): RestrictedSyntax[] {
  return rule(
    `/(^| )(dark:|hover:|focus:|group-hover:)*(text|bg|border|ring|fill|stroke|decoration)-(${RENAMED_INKS})-foreground($| )/`,
    "That is the deprecated name for the same hue's `-ink`. In this package `-foreground` is the label printed on a fill and `-ink` is the hue used as words, and none of these hues has a printed-on label — they are checked at 4.5:1 against the page, and printing one on its own fill measures about 1.2:1. Use `-ink`.",
  );
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
export function linkRules(): RestrictedSyntax[] {
  return [
    {
      selector:
        'JSXOpeningElement[name.name=/^(Button|Badge|Card)$/] > JSXAttribute[name.name="render"] > JSXExpressionContainer > JSXElement > JSXOpeningElement[name.name="a"]',
      message:
        "Pass `href` instead of rendering an anchor. A cloned <a> bypasses the router (full page load, no view transition) and gets no rel on an off-site href; `href` routes through the package's one rule. `render` is for an element that is not a link.",
    },
  ];
}

export interface TypographyOptions {
  /** Three-weight ramp. Off for editorial, where 700 is a register not a shout. */
  weights?: boolean;
  /** The rungs, named in the message, since they differ per consumer. */
  ramp?: string;
  /**
   * Flag a `ui` paragraph standing over a prose list. Off by default: it is the
   * one rule here that reads shape rather than a value, and a consumer has to
   * have migrated its dense-card lists to `TypographyList variant="ui"` before
   * it can pass. Turn it on once that is done.
   */
  pairing?: boolean;
  /**
   * Flag a size class on a primitive that already owns a size axis. Off by
   * default for the same reason as `pairing`: it fails until the consumer has
   * migrated, and that migration is the intended end state.
   */
  axis?: boolean;
}

export function typographyRules({
  weights = false,
  ramp = "text-3xs 10 / text-2xs 11 / text-xs 12 / text-sm 14 / text-base 16 and up",
  pairing = false,
  axis = false,
}: TypographyOptions = {}): RestrictedSyntax[] {
  return [
    // Alpha ink composites against whatever surface it lands on, so its
    // contrast is unmeasurable. The ink tokens are measured.
    // `\x2f`, never a literal slash: ESLint 8's esquery ends the regex at the
    // first `/` it sees, however escaped, and hands RegExp the truncated half.
    ...rule(
      "/text-(foreground|muted-foreground|subtle-foreground)\\x2f\\d+/",
      "Alpha on a text token has unmeasurable contrast (it composites against whatever surface it lands on). Use text-foreground (primary), text-muted-foreground (secondary), or text-subtle-foreground (tertiary).",
    ),
    // px only: a rem value at display scale is an ornament, not a rung.
    ...rule(
      "/(^| )text-\\[\\d+px\\]/",
      `Arbitrary font sizes bypass the type ramp. Use a rung (${ramp}).`,
    ),
    // A primitive that owns a size axis, reached past for a class that does the
    // same thing. The class wins on the page, so nothing looks wrong — what is
    // lost is everything else the axis carries: `TypographyCaption` pins leading
    // per rung because a wrapped caption sets cramped at the ramp's own setting,
    // and `TypographyStat` pairs its rungs with the heading ladder so a figure
    // and the heading beside it retune together on an editorial surface. A
    // literal gets the size and silently drops the rest.
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
            message:
              "This primitive owns its size: pass the axis (TypographySmall/Caption size=, TypographyStat size=, TypographyEyebrow tone=) rather than a text-* class, which takes the size and drops the leading and ladder that come with the rung.",
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
            selector:
              'JSXElement:has(>JSXOpeningElement[name.name="TypographyP"]) ~ JSXElement > JSXOpeningElement[name.name="TypographyProseList"]',
            message:
              'A ui paragraph over a prose list splits one passage across two rungs. Promote the paragraph with TypographyProse, or drop the list to the paragraph\'s rung with TypographyList variant="ui".',
          },
        ]
      : []),
    ...(weights
      ? rule(
          "/(^| )font-(bold|extrabold|black)( |$)/",
          "The product weight ramp is 400 body / 500 label / 600 heading. Use font-semibold for headings, or a label primitive for a label.",
        )
      : []),
  ];
}

/**
 * Every design rule, as one list.
 *
 * The builders below it are still exported, and spreading them by hand is
 * what both consumers were doing — one of them into a flat config, the other
 * into a legacy `.eslintrc`, and *both* of them had quietly left out
 * `renamedTokenRules`, so neither would have flagged a deprecated token name.
 * That is not a mistake either author made; it is what a five-name API costs
 * every time somebody wires it up. Spread this instead, and a rule added here
 * arrives in both apps on their next bump.
 */
export interface DesignRuleOptions extends ColourOptions, TypographyOptions {
  /**
   * Off for a surface that sets its own type ramp — a marketing page under
   * `.editorial`, a mockup drawing the product at reduced scale. Everything
   * about colour still applies: a deprecated token name is wrong on every
   * surface, which is why this is a flag rather than an invitation to pick
   * three of the five builders by hand.
   */
  typography?: boolean;
}

export function designRules({
  accents,
  typography = true,
  ...type
}: DesignRuleOptions = {}): RestrictedSyntax[] {
  return [
    ...colourRules({ accents }),
    ...(typography ? typographyRules(type) : []),
    ...linkRules(),
    ...themeOverrideRules(),
    ...surfaceAsInkRules(),
    ...renamedTokenRules(),
  ];
}

/** A flat-config entry, described structurally so the package needs no ESLint dependency. */
export interface FlatConfigEntry {
  name: string;
  files: string[];
  rules: Record<string, unknown>;
}

export interface DesignConfigOptions extends DesignRuleOptions {
  /** What the rules apply to. Narrow it to exclude generated or vendored code. */
  files?: string[];
}

/**
 * Every rule in one flat-config entry, ready to spread into eslint.config.js:
 *
 *   import { designConfig } from "@supertype.ai/foundations/eslint";
 *   export default [ ...designConfig({ accents: "the brand tints" }) ];
 *
 * One entry is not a detail. Flat config replaces a rule's options rather than
 * merging them, so two blocks covering overlapping files leave only the last
 * one's rules in effect. Combining them here is what stops a consumer losing
 * half the set by accident. If you need a second scope, call this again with a
 * different `files` and no overlap.
 */
export function designConfig({
  files = ["**/*.{ts,tsx,js,jsx}"],
  ...options
}: DesignConfigOptions = {}): FlatConfigEntry[] {
  return [
    {
      name: "@supertype.ai/foundations/design",
      files,
      rules: {
        "no-restricted-syntax": ["error", ...designRules(options)],
      },
    },
  ];
}

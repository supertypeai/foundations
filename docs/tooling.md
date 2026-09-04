[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [The CLI](cli.md)

---

# Build-time tooling

The parts that never reach a browser: page metadata, social cards, the design
rules as lint selectors, and a contrast sweep over the token layer.

## SEO and OG images

```ts
// lib/seo.ts
import { createSeo } from "@supertype.ai/foundations/seo";

const seo = createSeo({
  baseUrl: "https://supertype.ai",
  siteName: "Supertype",
  defaultOgImage: "https://…/card.png",
  logoUrl: "https://…/logo.png",
  articleBasePath: "notes",
});

export const { buildMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd,
               buildItemListJsonLd, buildFaqJsonLd, buildWebPageJsonLd } = seo;
```

```tsx
// app/notes/[slug]/page.tsx
export const metadata = buildMetadata(title, description, `notes/${slug}`);

<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify(buildArticleJsonLd(title, description, `notes/${slug}`,
    [{ name: "Samuel Chan", jobTitle: "Founder" }], datePublished, image, dateModified,
    { keywords: tags, readingMinutes: minutes })),
}} />
```

These are plain functions with no `next` import, not even a type-only one.
`buildMetadata` returns an object that is structurally assignable to Next's
`Metadata`.

The canonical URL it sets is a path, which Next resolves against `metadataBase`.
Do not set `metadataBase` in the root layout: it merges into every page and ends
up declaring them all duplicates of the homepage.

`seo.ORG_ID` and `seo.WEBSITE_ID` are stable `@id` anchors, so crawlers can merge
the site's entities rather than collecting several near-identical ones.

For social cards, `ogCard` returns an element tree rather than an image. The
package never imports `next/og`; your app creates the `ImageResponse`:

```tsx
import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@supertype.ai/foundations/og";

export const size = OG_SIZE;
export function GET() {
  return new ImageResponse(ogCard({ title, description, site: "supertype.ai" }), OG_SIZE);
}
```

---

## Lint rules

`@supertype.ai/foundations/eslint` ships the design rules as ESLint selectors, so
both apps enforce the same set. For flat config, one line does it:

```js
// eslint.config.js
import { designConfig } from "@supertype.ai/foundations/eslint";

export default [
  ...designConfig({ accents: "the brand tints", weights: true }),
];
```

`designConfig` returns a single entry holding a single `no-restricted-syntax`
rule, which matters: flat config replaces a rule's options rather than merging
them, so two entries covering overlapping files would leave only the last one's
rules in effect. It takes the same options as the builders below, plus `files`
to narrow what it applies to.

On `.eslintrc`, or anywhere you need the rules without the wrapper, spread
`designRules` — the same list `designConfig` puts in that entry:

```js
const { designRules } = require("@supertype.ai/foundations/eslint");

rules: {
  "no-restricted-syntax": [
    "error",
    ...designRules({ accents: "the brand tints", weights: true,
                     ramp: "text-xs 12 / text-sm 13 / …" }),
  ],
}
```

Pass `typography: false` for a surface that sets its own ramp — a marketing page
under `.editorial`, a mockup drawing the product at reduced scale. Colour still
applies: a deprecated token name is wrong on every surface.

The five builders (`colourRules`, `typographyRules`, `themeOverrideRules`,
`surfaceAsInkRules`, `renamedTokenRules`) are still exported for a config that
needs something narrower. Reach for them last. This page used to show four of
the five being spread by hand, both apps copied it, and for as long as that
stood neither of them ran `renamedTokenRules` — so a token rename the package
had already shipped went unenforced, and fifty-three call sites accumulated
behind a rule that had never once fired.

It is plain data, with no plugin and no ESLint dependency of its own. There is an
ESM build and a CommonJS one under `dist/cjs`, so a flat config's `import` and an
`.eslintrc.cjs`'s `require` both resolve without relying on Node's require(ESM).

Only the things that genuinely vary per app are arguments: the accent names used
in the message, the size ramp, and `weights`, which holds a file to three weights.
`weights` is off by default because 700 is a reasonable headline weight on an
editorial surface. `themeOverrideRules()` and `surfaceAsInkRules()` take no
arguments, since what they forbid should not vary per app.

The rules live in the package because keeping a copy in each app did not work.
The colour rules were kept in step by hand and the typography rules never made it
across at all, and ssite accumulated 78 one-off font sizes against rules that had
been blocking its sibling for months.

Three things to know before adding a rule:

- **Write regex escapes as `\x2f`, never a literal `/`.** The version of esquery
  bundled with ESLint 8 ends a selector's pattern at the first slash it sees,
  however you escape or enclose it, and passes the truncated half to `RegExp`.
- **Use one `no-restricted-syntax` entry per file scope.** Flat config replaces a
  rule's options rather than merging them, so two blocks covering overlapping
  files will quietly drop the first one's rules.
- **Restrict the solid form, not the alpha.** `dark:bg-card` says the token is
  wrong. `dark:bg-destructive/20` against a `/10` in light is the same token at
  the density a darker background needs. Only the first is a defect.

One thing these rules cannot see is the shape of a class list. Something like
`text-xs text-foreground leading-tight` is three legal utilities, and no selector
knows that a primitive already renders exactly that. The fix is a component
people reach for first, not another rule.

### Contrast checks

`@supertype.ai/foundations/contrast` resolves the token layer the way the cascade
does and checks it against a legibility floor. It runs at build time only, on
strings and numbers, with no React and no DOM:

```ts
import { resolveTokens, checkLegibility, formatFailures } from "@supertype.ai/foundations/contrast";

// The token layer as the browser sees it: package first, then the app's own.
const css = [tokensCss, themeCss, typeCss, appCss].join("\n");

// Every ink on every surface, both themes. 4.5:1 by default.
const failures = checkLegibility(css);
expect(failures, formatFailures(failures)).toEqual([]);

// Or read one resolved value.
expect(resolveTokens(css, "light")["--card"]).not.toBe(resolveTokens(css, "dark")["--card"]);
```

`checkLegibility(css, { minimum, inks, surfaces, themes })` sweeps
`--foreground`, `--muted-foreground` and `--card-foreground` over `--background`,
`--card` and `--muted` in both themes unless you narrow it.

It resolves the cascade instead of reading the declarations because a bare
`:root` override of `--background` ties with `.dark` on specificity and wins in
both themes. Reading the two blocks separately would report no problem while dark
mode renders on a white surface.

`specificity`, `parseColor`, `luminance` and `contrast` are exported too, for a
test that needs one piece of this.

## Optical offset

```ts
import { checkOptical, formatOffsets } from "@supertype.ai/foundations/optical";

const UBUNTU_SANS = { unitsPerEm: 1000, ascent: 940, descent: 260, capHeight: 727 };

const out = checkOptical(UBUNTU_SANS, [
  { name: "2xs", fontSize: 11 },
  { name: "sm", fontSize: 13 },
  { name: "h1", fontSize: 22 },
]);
// 2xs comes back: an icon centred beside it lands half a pixel under the
// letters, a sixteenth of the cap band, so that text wants CAP_TRIM. 13px is
// flat, and the same half pixel at 22px is 3% of a much taller band.
```

`items-center` centres line boxes, and a line box holds leading, ascent and
descent that the letters may not use. Whether the ink inside it is centred too is
a property of the face, so it is worth computing once for a ramp instead of
discovering it a call site at a time.

The arithmetic is one line, and the rounding is the whole reason it earns a file.
In ratios a face has one tilt at every size, 0.0235em for Ubuntu Sans, which says
nothing about where to spend a trim. Browsers quantise ascent, descent and cap
height to whole pixels before they lay a line out, and rounded, the same face is
half a pixel out at 11px, flat at 13px, and half a pixel out again at 22px. The
rendered pages show that shape at roughly double the size, because paint rounds
the baseline a second time in the same direction.

Feed it metrics you have checked. `next/font`'s table gives Ubuntu Sans a cap
height of 693 where the browser measures 727, through `actualBoundingBoxAscent`
on a canvas-drawn H, and the wrong figure reports the page title rung as flat
when it renders a pixel out. Ascent and descent in that table are right, so cap
height is the one worth confirming.

The verdict is a share rather than a pixel, and that is the part worth
understanding. Half a pixel is most of a ramp: on Ubuntu Sans only 13px and 24px
land flat. What separates a rung a reader sees from one nobody does is what the
miss is half a pixel of, a sixteenth of an 11px cap band against a thirty-second
of a 36px one, so `tolerance` is a fraction of the cap band and defaults to 0.05.
Pass 0 to see the whole ramp.

Two more things follow for reading the output. Leading is not a lever, since
half-leading cancels and a rung that is out stays out however it is set. And the
number is a floor rather than a verdict, so treat a rung that comes back as one
to trim and not as a pixel count to subtract.

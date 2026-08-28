[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [The CLI](cli.md)

---

# Build-time tooling

The parts that never reach a browser: page metadata, social cards, the design
rules as lint selectors, and a contrast sweep over the token layer.

## SEO and OG images

```ts
// lib/seo.ts
import { createSeo } from "@supertype/foundations/seo";

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
import { ogCard, OG_SIZE } from "@supertype/foundations/og";

export const size = OG_SIZE;
export function GET() {
  return new ImageResponse(ogCard({ title, description, site: "supertype.ai" }), OG_SIZE);
}
```

---

## Lint rules

`@supertype/foundations/eslint` ships the design rules as ESLint selectors, so
both apps enforce the same set. For flat config, one line does it:

```js
// eslint.config.js
import { designConfig } from "@supertype/foundations/eslint";

export default [
  ...designConfig({ accents: "the brand tints", weights: true }),
];
```

`designConfig` returns a single entry holding a single `no-restricted-syntax`
rule, which matters: flat config replaces a rule's options rather than merging
them, so two entries covering overlapping files would leave only the last one's
rules in effect. It takes the same options as the builders below, plus `files`
to narrow what it applies to.

To assemble the set yourself, or on `.eslintrc`, use the builders directly:

```js
import { colourRules, typographyRules, themeOverrideRules,
         surfaceAsInkRules } from "@supertype/foundations/eslint";

rules: {
  "no-restricted-syntax": [
    "error",
    ...colourRules({ accents: "the brand tints" }),
    ...typographyRules({ weights: true, ramp: "text-xs 12 / text-sm 13 / …" }),
    ...themeOverrideRules(),
    ...surfaceAsInkRules(),
  ],
}
```

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

`@supertype/foundations/contrast` resolves the token layer the way the cascade
does and checks it against a legibility floor. It runs at build time only, on
strings and numbers, with no React and no DOM:

```ts
import { resolveTokens, checkLegibility, formatFailures } from "@supertype/foundations/contrast";

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

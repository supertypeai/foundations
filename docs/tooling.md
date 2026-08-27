[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md)

---

# Build-time tooling

The parts that never reach a browser: page metadata, social cards, the design
rules as lint selectors, and the contrast sweep over the token layer.

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

Pure functions with no `next` import, not even a type one — `buildMetadata`
returns an object structurally assignable to Next's `Metadata`. The canonical it
sets is a *path*: Next resolves it against `metadataBase`, and setting one in the
root layout would merge into every page and declare them all duplicates of the
homepage. `seo.ORG_ID` / `seo.WEBSITE_ID` are stable `@id` anchors, so crawlers
merge the site's entities instead of collecting near-duplicates.

For social cards, `ogCard` returns a *tree*, not an image — the package never
imports `next/og`, and the app owns the `ImageResponse`:

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
both apps enforce one set:

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

Plain data — no plugin, no ESLint dependency — with an ESM build and a CommonJS
one under `dist/cjs`, so a flat config's `import` and an `.eslintrc.cjs`'s
`require` both resolve without depending on Node's require(ESM). Only what
genuinely differs per app is an argument: the accent names in the message, the
rungs, and `weights`, which holds a file to a three-weight ramp and is off by
default because 700 is a real headline register on an editorial surface.
`themeOverrideRules()` and `surfaceAsInkRules()` take none — what they forbid is
not negotiable per app.

They live here because the split is what failed. Each app held a private copy;
the colour half stayed in step by hand and the typography half never crossed over
at all, so ssite grew 78 arbitrary font sizes against rules its sibling had been
blocked by for months.

Three things to know before adding a rule:

- **Write regex escapes as `\x2f`, never a literal `/`.** The esquery bundled
  with ESLint 8 ends a selector's pattern at the first slash it sees, however it
  is escaped or enclosed, and hands `RegExp` the truncated half.
- **One `no-restricted-syntax` entry per file scope.** Flat config replaces a
  rule's options rather than merging them, so two blocks over overlapping files
  silently discard the first one's rules.
- **Restrict the solid form, not the alpha.** `dark:bg-card` is a claim that the
  token is wrong; `dark:bg-destructive/20` against a `/10` in light is the same
  token at the density a darker ground needs. Only the first is a defect.

What these rules cannot see is the shape of a class list. `text-xs
text-foreground leading-tight` is three legal utilities, and no selector knows a
primitive already renders it. Only a component people reach for first fixes that.

### Contrast checks

`@supertype/foundations/contrast` resolves the token layer the way the cascade
does and holds it to a legibility floor. Build-time only — strings and numbers,
no React, no DOM:

```ts
import { resolveTokens, checkLegibility, formatFailures } from "@supertype/foundations/contrast";

// The token layer as the browser sees it: package first, then the app's own.
const css = [tokensCss, themeCss, typeCss, appCss].join("\n");

// Every ink on every surface, both themes. 4.5:1 by default.
const failures = checkLegibility(css);
expect(failures, formatFailures(failures)).toEqual([]);

// Or reach for one resolved value.
expect(resolveTokens(css, "light")["--card"]).not.toBe(resolveTokens(css, "dark")["--card"]);
```

`checkLegibility(css, { minimum, inks, surfaces, themes })` sweeps
`--foreground` / `--muted-foreground` / `--card-foreground` over `--background` /
`--card` / `--muted` in both themes unless you narrow it.

Resolving rather than reading the declarations is the point: a bare `:root`
override of `--background` ties `.dark` on specificity and wins both themes, so
reading the blocks separately proves nothing while dark mode keeps a white
surface. `specificity`, `parseColor`, `luminance` and `contrast` are exported for
a test that needs a piece of it.


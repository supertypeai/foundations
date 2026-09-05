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

export const {
  buildMetadata,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildFaqJsonLd,
  buildWebPageJsonLd,
} = seo;
```

```tsx
// app/notes/[slug]/page.tsx
export const metadata = buildMetadata(title, description, `notes/${slug}`);

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      buildArticleJsonLd(
        title,
        description,
        `notes/${slug}`,
        [{ name: "Samuel Chan", jobTitle: "Founder" }],
        datePublished,
        image,
        dateModified,
        { keywords: tags, readingMinutes: minutes },
      ),
    ),
  }}
/>;
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
  return new ImageResponse(
    ogCard({ title, description, site: "supertype.ai" }),
    OG_SIZE,
  );
}
```

---

## Lint rules

`@supertype.ai/foundations/eslint` ships the design rules as ESLint selectors, so
both apps enforce the same set. One function returns them, and the call site is
whatever config shape you are in:

```js
import { designRules } from "@supertype.ai/foundations/eslint";

rules: {
  "no-restricted-syntax": [
    "error",
    ...designRules({ accents: "the brand tints", weights: true,
                     ramp: "text-xs 12 / text-sm 13 / …" }),
  ],
}
```

Flat config replaces a rule's options rather than merging them, so two entries
covering overlapping files leave only the last one's rules standing. Spreading
the whole set in each entry is what makes that safe: a second, narrower entry is
then a superset rather than a subtraction.

Pass `typography: false` for a surface that sets its own ramp — a marketing page
under `.editorial`, a mockup drawing the product at reduced scale. Colour still
applies: a deprecated token name is wrong on every surface.

One function builds the whole set. The older pattern spread several rule builders
by hand, so a config could miss one of them without failing. The helper keeps the
set consistent and prevents that drift.

This is plain data, with no plugin and no ESLint dependency of its own. The
package ships ESM and CommonJS builds under `dist/cjs`, so both a flat config's
`import` and an `.eslintrc.cjs` `require` resolve without relying on Node's
`require(ESM)` behavior.

Only the things that genuinely vary per app are arguments: the accent names used
in the message, the size ramp, and `weights`, which holds a file to three weights.
`weights` is off by default because 700 is a reasonable headline weight on an
editorial surface. The token and surface rules take no arguments, since what they
forbid should not vary per app.

Four rules ship off. `axis`, `pairing` and `leading` each name a sweep an app
finishes before switching one on. `inlineStyle` flags a literal colour inside a
`style` object, the one place no className rule can see, and stays off for a
different reason: a card rendered by Satori has to state its colours literally,
since `next/og` resolves no custom properties. Turn it on for the directories
that render for a browser and leave the OG routes out.

What the set covers, in one pass: the raw Tailwind palette, solid white and
black, a hex on any colour utility including gradient stops, an arbitrary font
size in any unit, a type style hand-written on a `<p>` or a heading, a rung
passed as a class to a primitive that owns a size prop, a deprecated
`-foreground` spelling, a `dark:` override of a token, a surface token printed as
ink, a `size-` class on a mark inside a control that sizes its own, a vertical
margin nudging an inline mark into line, and `render={<a href>}` on a component
that takes `href`.

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

These rules cannot see the shape of a class list. Something like
`text-xs text-foreground leading-tight` is three legal utilities, and no selector
knows that a primitive already renders exactly that. The fix is to reach for the
component first, not add another rule.

### Contrast checks

`@supertype.ai/foundations/contrast` resolves the token layer the way the cascade
does and checks it against a legibility floor. It runs at build time only, on
strings and numbers, with no React and no DOM:

```ts
import {
  resolveTokens,
  checkLegibility,
  formatFailures,
} from "@supertype.ai/foundations/contrast";

// The token layer as the browser sees it: package first, then the app's own.
const css = [tokensCss, themeCss, typeCss, appCss].join("\n");

// Every ink on every surface, both themes. 4.5:1 by default.
const failures = checkLegibility(css);
expect(failures, formatFailures(failures)).toEqual([]);

// Or read one resolved value.
expect(resolveTokens(css, "light")["--card"]).not.toBe(
  resolveTokens(css, "dark")["--card"],
);
```

`checkLegibility(css, { minimum, inks, surfaces, themes })` sweeps
`--foreground`, `--muted-foreground` and `--card-foreground` over `--background`,
`--card` and `--muted` in both themes unless you narrow it.

It resolves the cascade instead of reading the declarations: a bare `:root`
override of `--background` ties with `.dark` on specificity and wins in both
themes. Reading the two blocks separately would report no problem while dark mode
renders on a white surface.

`specificity`, `parseColor`, `luminance` and `contrast` are exported too, for a
test that needs one piece of this.

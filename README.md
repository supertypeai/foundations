# @supertype/foundations

The shared design layer behind the Supertype projects: typography primitives,
content blocks, the long-form essay shell, the token/theme CSS, and the
build-time tooling (SEO, OG cards, lint rules, contrast checks) that keeps them
honest.

Named for what it is rather than what it started as — the first cut was
typography only, and `prose` stopped describing it the moment it grew a reading
rail and a JSON-LD builder.

**Start here:** [Install](#install) → [Your first page](#your-first-page).

**Reference:** [Typography](docs/typography.md) · [Blocks](docs/blocks.md) ·
[The essay shell](docs/essay.md) · [Build-time tooling](docs/tooling.md)

---

## Install

### 1. Add the package

```jsonc
// package.json — pin a tag, never `#main`
"@supertype/foundations": "https://github.com/supertypeai/foundations.git#v0.1.19"
```

`dist/` is committed, so a consumer clones a package that is already built:
no `prepare` step, no install-time compile. Peers are React >=19, Next >=15,
`next-view-transitions` >=0.3 and `@base-ui/react` >=1.4 — every project on this
package is a Next app, and the peers say so deliberately.

### 2. Import the CSS, in this order

```css
/* app/global.css */
@import "tailwindcss";
@import "@supertype/foundations/tokens.css";  /* structural tokens + dark variant */
@import "@supertype/foundations/theme.css";   /* the house palette */
@import "@supertype/foundations/type.css";    /* the type ramp + font roles */
@import "@supertype/foundations/prose.css";   /* inline-code rule */
@import "@supertype/foundations/shiki.css";   /* only if you render code fences */

@source '../node_modules/@supertype/foundations/dist/**/*.js';
```

**The `@source` line is required.** Without it Tailwind never scans the package
and every class it ships is purged — the components render with no styles at all.

**`theme.css` is not as optional as it looks.** It is the only file that defines
`--secondary-ink`, `--subtle-foreground`, the four earth tones the marker
highlight paints with, and the `accordion-down` / `accordion-up` keyframes. Skip
it and `<TypographyHighlight tone="sage">`, `<TypographyLink tone="secondary">`
and the interactive `<Accordion>` all degrade silently. Import it unless you are
deliberately supplying your own palette for every one of those names.

### 3. Bind the fonts

The package cannot load faces — `next/font` is app-level and mints hashed
variable names at build time. Each consumer loads the three and binds them to
the roles `type.css` names:

```tsx
// app/layout.tsx
import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

<html className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans`}>
```

**Bind with `.variable`, never `.className`.** A className sets `font-family` on
the element and leaves the roles resolving to their generic tails, so the page
renders one face while every `font-sans` and `font-heading` utility on it renders
another. ssite shipped that way for months: Inter on `<html>`, system-ui on
anything that asked for a role.

---

## Your first page

```tsx
import {
  TypographyH1,
  TypographyH2,
  TypographyProse,
  TypographyEyebrow,
  TypographyLink,
  TypographyCaption,
} from "@supertype/foundations";
import { Card, Cards, Callout } from "@supertype/foundations/blocks";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Guides</TypographyEyebrow>
      <TypographyH1 variant="display" className="mt-2 text-balance">
        Getting data out of Postgres
      </TypographyH1>
      <TypographyProse className="mt-4">
        Three approaches, ordered by how much of your schema they need to know.
      </TypographyProse>

      <TypographyH2 divider className="mt-12">Approaches</TypographyH2>

      <Cards>
        <Card
          href="/notes/logical-replication"
          title="Logical replication"
          description="Row-level changes, no schema coupling."
        />
        <Card
          href="https://www.postgresql.org/docs/current/sql-copy.html"
          title="COPY"
          description="Fastest bulk path. Leaves the app."
        />
      </Cards>

      <Callout tone="warn" title="Before you start" className="mt-8">
        Replication slots hold WAL until they are consumed. An abandoned slot
        fills the disk — see <TypographyLink href="/ops/slots" addArrow>slot hygiene</TypographyLink>.
      </Callout>

      <TypographyCaption as="p" className="mt-8">Last reviewed March 2026</TypographyCaption>
    </main>
  );
}
```

Two rules that explain most of the API:

- **Never spell a type style by hand.** `<p className="text-sm text-muted-foreground">`
  is `<TypographyMuted>`. The primitives exist so that a size and an ink cannot
  drift apart across two hundred call sites.
- **Retune through CSS variables, not classes.** The package owns its final
  classnames; you change `--prose-measure`, `--heading-weight`, or a colour
  token, and everything moves together.

---

## Entry points

Split by dependency profile, not by taste. A project that wants typography
should not resolve the essay layer's client components, and build tooling must
not resolve React at all.

| import | contains | docs |
|---|---|---|
| `@supertype/foundations` | all typography primitives, `cn` | [Typography](docs/typography.md) |
| `@supertype/foundations/blocks` | `Card`, `Callout`, `Steps`, `Tabs`, `Accordion`, `Disclosure`, `SEGMENT` | [Blocks](docs/blocks.md) |
| `@supertype/foundations/mdx` | `proseMdxComponents` — the MDX element map | [In MDX](docs/blocks.md#in-mdx) |
| `@supertype/foundations/essay` | the long-form shell, TOC, reading rail, post meta | [Essay](docs/essay.md) |
| `@supertype/foundations/seo` | `createSeo(...)` — metadata + JSON-LD | [Tooling](docs/tooling.md#seo-and-og-images) |
| `@supertype/foundations/og` | `ogCard`, `OG_SIZE` — an element for `next/og` | [Tooling](docs/tooling.md#seo-and-og-images) |
| `@supertype/foundations/eslint` | the design rules as ESLint selectors | [Tooling](docs/tooling.md#lint-rules) |
| `@supertype/foundations/rehype` | `rehypeProseCode` — **build-time only** | [In MDX](docs/blocks.md#in-mdx) |
| `@supertype/foundations/contrast` | token resolution + legibility checks, build-time only | [Tooling](docs/tooling.md#contrast-checks) |
| `./tokens.css` `./theme.css` `./type.css` `./prose.css` `./shiki.css` | the style layer | [Tokens and theming](#tokens-and-theming) |

Blocks and the MDX map are deliberately absent from the root barrel — see
[Why the entry points are split](#why-the-entry-points-are-split) under Design
rules.

---

## Tokens and theming

`tokens.css` names the structural roles — `--background`, `--foreground`,
`--card`, `--muted`, `--primary`, `--border`, `--ring`, plus the status set
(`--success`, `--warn`, `--info`, `--destructive`, with `danger` aliasing the
last). Named for meaning, not hue: a `success` a project renders blue still reads
correctly. It also binds the `dark:` variant to the `.dark` class — not optional,
and its absence is silent, since Tailwind v4 would otherwise follow the OS and
ignore your toggle.

`theme.css` paints those roles with the house latte/espresso palette and adds the
editorial inks (`--secondary-ink`, `--subtle-foreground`, the ochre / terracotta
/ sage / fig pairs) and the elevation shadows.

**No brand colours in the package.** Structural tokens only; brand stays in the
app. To repaint, override the raw variables after the imports — never patch the
utilities:

```css
:root  { --primary: hsl(24 60% 42%); }
.dark  { --primary: hsl(24 70% 62%); }
```

### `.editorial`

`type.css` names three font roles — `--font-sans`, `--font-mono`, `--font-heading`
— and the weight rung that travels with the heading face. `.editorial` hands the
heading role to the serif and drops the weight to 400, because Average has
exactly one:

```tsx
<div className="editorial">…</div>   {/* or on <html> for an editorial site */}
```

It also retunes the whole heading ladder, which is the point: a heading's size is
a *ratio* to the body under it, and the two surfaces set body at different rungs
(13px in the product, 18px on `.editorial`). viably scopes it to marketing and
docs and keeps its product on the sans; ssite is editorial throughout.

The roles stay plain `@theme` and never `@theme inline` — `inline` bakes the
family into the utility and the subtree swap stops resolving.

---

## Design rules

1. **The package owns final classnames.** Consumers retune through CSS custom
   properties (`--prose-measure`, `--prose-leading`, `--heading-weight`, the
   colour tokens), never by patching classes.
2. **No variant props on the MDX map.** Elements MDX renders automatically take
   no options — there is no call site to make the choice. Components you invoke
   by hand may carry variants.
3. **The platform first, a library only where it cannot reach.** `Disclosure` is
   `<details>`/`<summary>`: no JS, correct before hydration, free to an MDX
   author. `Accordion` and `Tabs` are Base UI, because animation and managed
   selection are past what the platform ships.
4. **No brand colours.** Structural tokens only. Brand stays in the app.
5. **Structure belongs in CSS, not the component map.** A host framework may
   substitute its own element and strip classes; a child combinator cannot be
   stripped. Both the Shiki theming and the inline-code rule work this way.
6. **A preset cannot be un-set.** `TypographyMuted` is `TypographyP` with the ink
   decided, and the axis it decides leaves its prop type — pass the pinned object
   to `Preset<Base, typeof PINS>` and spread that same object last. A preset that
   still accepts the prop it exists to settle is not a preset; it is a default
   with a longer name.
7. **A variant earns its place at a call site.** Anything with no call sites in
   either consumer is dead weight and gets removed, not kept "in case" — the
   `size` axis on `Card` and the vertical orientation on `Tabs` both went that
   way.

### No injection

Import `TypographyLink` and `Card` by name. There is no binding step:

```tsx
import { TypographyLink } from "@supertype/foundations";
import { Card } from "@supertype/foundations/blocks";
```

Both import the router directly from `next-view-transitions`, a peer dependency.
This replaced a `createProseLink(Link)` / `createCard(Link)` injection pair, and
the swap was not a simplification for its own sake: a factory bought
router-agnosticism nobody used, at the price of a component that could not be
imported by name — which is how one call site ended up on the unbound export and
silently lost its link decoration. **Do not reinstate injection.**
`paragraph.tsx` documents the call site it cost.

### Why the entry points are split

A barrel's transitive dependencies are paid by every name it exports, which is
why the root entry is typography and nothing else. `mdx.tsx` imports
`next/image`, and a bare subpath like that does not resolve from inside
`node_modules` under a plain Node ESM loader — the loader a consumer's test
runner uses. Re-exporting it made every test that so much as touched a Typography
component fail to import. `blocks/` carries the same hazard one dependency
further out: `tabs.tsx` and `interactive-accordion.tsx` pull `@base-ui/react`, so
re-exporting them made a bare `import { TypographyH2 }` resolve Base UI.

`/rehype` is separate for the mirror-image reason: `source.config.ts` and friends
run in bare Node, where React is not resolvable at all.

What the split does **not** buy is a plain-Node-importable root. Measured, not
assumed — `node -e "import('@supertype/foundations')"` from a consumer still
fails on `ERR_MODULE_NOT_FOUND` for `next/link`, because `TypographyLink` imports
`next-view-transitions`, which imports `next/link`. The blocks entry fails
identically through `card.tsx`. This is survivable because the runner that
matters resolves it: both consumers' vitest suites import typography freely and
pass.

---

## Working on the package

### Local iteration

Consumers pin a git tag, which is right for anything that ships and wrong for the
ten-minute loop of nudging a value and looking at it. `yarn sync` closes that
loop without a tag:

```sh
yarn sync        # build, then copy into each consumer's node_modules
yarn dev:sync    # same, on every save under src/
```

It writes to `node_modules/@supertype/foundations` in `ssite` and
`viably/on_next`, looked up under `~/Work` then `~/fun` (pass paths as arguments
for anywhere else). Nothing else is touched: their `package.json` still names the
tag, their lockfile still resolves it, and CI and production install exactly what
they did before. The one place a sync exists is a directory yarn will overwrite
on its next install — so a synced build cannot leave the machine it was made on,
and re-running `yarn install` in a consumer is how you undo it.

Restart the consumer's dev server after a sync. Next caches `node_modules` under
both bundlers and will keep serving the previous build otherwise.

Do not `yarn link`. Turbopack resolves the symlink to a path outside the project
root and the dev server dies on the CSS import; it also puts a second React on
the resolution path for a package with React as a peer, which surfaces as an
invalid-hook-call at runtime.

Sync is for iterating. Once a change is settled, release it — a consumer whose
behaviour depends on an unreleased sync is broken for everyone else.

### Releasing

```sh
yarn release   # bump -> build -> commit -> tag -> push
```

It refuses to run on a dirty tree, so commit your work first. The bump is part of
releasing rather than a step to remember: consumers pin a tag and yarn records
the commit behind it, so shipping new code under an existing tag leaves them on
whatever they resolved the first time.

`dist/` is tracked on purpose. The alternative — a `prepare` script that builds
on the consumer's side — makes every install spawn a nested `yarn install` that
shares one cache with the install that spawned it; the two race on any package
both need, which corrupted the cache and failed CI. Do not re-add `dist/` to
`.gitignore`. `yarn release` always rebuilds before staging, so the committed
output cannot drift from source as long as releases go through it.

Then repoint each consumer and commit its lockfile:

```sh
yarn add "@supertype/foundations@https://github.com/supertypeai/foundations.git#v<version>"
```

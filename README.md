# @supertype/foundations

Shared design foundations across the Supertype projects — typography, prose
rendering, the essay layer, and structured data.

Named for what it is rather than what it started as: the first cut was
typography only, and `prose` stopped describing it the moment it grew a reading
rail and a JSON-LD builder.

## Entry points

Split by dependency profile, not by taste. A project that wants typography
should not resolve the essay layer's client components, and build tooling must
not resolve React at all.

| import | contains | notes |
|---|---|---|
| `@supertype/foundations` | typography, blocks, MDX map, `cn` | server-safe except `Tabs` |
| `@supertype/foundations/essay` | `EssayColumns`, `ReadingRail`, post meta, TOC + reading time | reading components are client |
| `@supertype/foundations/seo` | `createSeo(...)` — metadata + JSON-LD | pure functions, no framework |
| `@supertype/foundations/rehype` | `rehypeProseCode` (Shiki) | **build-time only** — never import from a component |
| `@supertype/foundations/contrast` | `resolveTokens`, `checkLegibility`, `formatFailures` | build-time only — strings and numbers, no React, no DOM |
| `@supertype/foundations/og` | `ogCard`, `OG_SIZE` | returns an element for `next/og`; the app owns the `ImageResponse` |
| `./tokens.css` `./theme.css` `./type.css` `./prose.css` `./shiki.css` | the style layer | import in this order; `theme.css` is optional |

`/rehype` is separate because `source.config.ts` and friends run in bare Node,
where React is not resolvable. Re-exporting it from the root entry drags the
components in and breaks the build with `Cannot find package 'react'`.

## Consuming

React >=19 is a peer dependency; the package brings its own Shiki and styling
utilities and deliberately has no `next` dependency.

```jsonc
// package.json
"@supertype/foundations": "https://github.com/supertypeai/foundations.git#v0.1.15"
```

Pin a tag, never `#main`. yarn records the commit the tag pointed at, so a tag
that moves later leaves two consumers on two different builds under one version
— which is how ssite and viably once ended up three versions apart. `dist/` is
committed, so a consumer clones a package that is already built: there is no
`prepare` step and no install-time compile.

Do not `yarn link` for local work either. Turbopack resolves the symlink to a
path outside the project root and the dev server dies on the CSS import. To test
an unreleased change, commit it on a branch and point a consumer at that ref.

```css
/* app/global.css — order matters */
@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";   /* optional: the house palette */
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";
@import "@supertype/foundations/shiki.css";  /* only if you render code blocks */
@source '../node_modules/@supertype/foundations/dist/**/*.js';
```

The `@source` line is required. Without it Tailwind never scans the package and
every class it ships is purged.

Anything that links takes the app's router by injection, since the package has
no `next` dependency. Bind once, in one module, and import from there:

```tsx
// components/foundations.tsx
import { Link } from "next-view-transitions";
import { createCard, createProseLink } from "@supertype/foundations";

export const Card = createCard(Link);
export const TypographyLink = createProseLink(Link);
export * from "@supertype/foundations";
```

`createProseMdxComponents({ Link, Image })` is the same pattern for the MDX map.
Build tooling imports `/rehype` directly — `source.config.ts` runs in bare Node,
so it must not reach a module that resolves React:

```ts
// source.config.ts
import { rehypeProseCode } from "@supertype/foundations/rehype";
```

## Design rules

1. **The package owns final classnames.** Consumers retune through CSS custom
   properties (`--prose-measure`, `--prose-leading`, `--heading-weight`, the
   colour tokens), never by patching classes.
2. **No variant props on the MDX map.** Elements MDX renders automatically take
   no options — there is no call site to make the choice. Components you invoke
   by hand may carry variants.
3. **No interactive primitives.** `<details>` over a headless library. The
   consuming projects are split between Radix and Base UI; picking one would
   force a migration on the others for a widget the platform already ships.
4. **No brand colours.** Structural tokens only. Brand stays in the app.
5. **Structure belongs in CSS, not the component map.** A host framework may
   substitute its own element and strip classes; a child combinator cannot be
   stripped. Both the Shiki theming and the inline-code rule work this way.

## Type

`type.css` names three roles — `--font-sans`, `--font-mono`, `--font-heading` —
and the weight rung that travels with the heading face. Both apps resolve the
same stack from them: Ubuntu Sans, Ubuntu Sans Mono, and Average for editorial
display headings.

The package cannot load the faces. `next/font` is app-level and mints hashed
variable names at build time, so each consumer loads the three and binds them to
the slots:

```tsx
const ubuntuSans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
// …then, on <html>:
className={`${ubuntuSans.variable} ${ubuntuSansMono.variable} ${average.variable} font-sans`}
```

**Bind with `.variable`, never `.className`.** A className sets `font-family` on
the element and leaves the roles resolving to their generic tails, so the page
renders one face while every `font-sans` and `font-heading` utility on it renders
another. ssite shipped that way for months: Inter on `<html>`, system-ui on
anything that asked for a role.

`.editorial` hands the heading role to the serif and drops the weight to 400,
because Average has exactly one. Put it wherever the display face belongs — viably
scopes it to marketing and docs and keeps its product on the sans; ssite is
editorial throughout and wears it on `<html>`. The roles stay plain `@theme` and
never `@theme inline`, because `inline` bakes the family into the utility and the
subtree swap stops resolving.

## The essay shell

`@supertype/foundations/essay` carries the long-form reading surface — any page a
reader arrives at to read from the top rather than to scan for one thing:

```tsx
export const { EssayHeader, EssayLayout, EssaySection, EssayPullQuote,
               EssayFigure, EssayMovements, EssayDocument } = createEssay();
```

`createEssay({ Reveal, Glow })` is the same injection idiom as `createProseLink`
and `createCard`, for a related reason: motion and gradient belong to an app's
visual language, and hard-coding either would drag framer-motion into every
consumer or force one house style on all of them. Both default to nothing, so an
app that supplies neither gets identical markup, statically rendered. viably
passes its two; ssite passes none.

`EssayHeader` sets its own measure and is deliberately full-bleed, so the opening
can carry a backdrop edge to edge while the prose stays in column. A page puts it
*above* its `EssayColumns`, not inside.

`EssayDocument` is for a page whose sections are just heading and prose — the
margin index is derived from the sections rather than hand-kept beside them,
which is how a retitled section used to leave the rail scrolling to nothing. An
MDX article does not use it: its sections come from the markdown headings, so it
composes `EssayHeader` over `EssayColumns` with a `ReadingRail` instead.

## Lint rules

`@supertype/foundations/eslint` ships the design rules as ESLint selectors, so
both apps enforce one set:

```js
import { colourRules, typographyRules } from "@supertype/foundations/eslint";

rules: {
  "no-restricted-syntax": [
    "error",
    ...colourRules({ accents: "the brand tints" }),
    ...typographyRules({ weights: true, ramp: "text-xs 12 / text-sm 13 / ..." }),
  ],
}
```

It exports plain data — no plugin, no ESLint dependency — and ships an ESM build
plus a CommonJS one under `dist/cjs`, so a flat config's `import` and an
`.eslintrc.cjs`'s `require` both resolve without depending on Node's
require(ESM). Only the parts that genuinely differ per app
are arguments: the accent names in the message, the rungs, and `weights`, which
holds a file to a three-weight ramp and is off by default because 700 is a real
headline register on an editorial surface.

They live here because the split is what failed. Each app held a private copy;
the colour half stayed in step by hand and the typography half never crossed over
at all, so ssite grew 78 arbitrary font sizes against rules its sibling had been
blocked by for months.

`themeOverrideRules()` and `surfaceAsInkRules()` sit alongside them and take no
arguments — what they forbid is not negotiable per app.

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

## Local iteration

Consumers pin a git tag, which is right for anything that ships and wrong for
the ten-minute loop of nudging a value and looking at it. `yarn sync` closes
that loop without a tag:

```sh
yarn sync        # build, then copy into each consumer's node_modules
yarn dev:sync    # same, on every save under src/
```

It writes to `node_modules/@supertype/foundations` in `~/Work/ssite` and
`~/Work/viably/on_next` (pass paths as arguments for anywhere else). Nothing
else is touched: their `package.json` still names the tag, their lockfile still
resolves it, and CI and production install exactly what they did before. The
one place a sync exists is a directory yarn will overwrite on its next install —
so a synced build cannot leave the machine it was made on, and re-running
`yarn install` in a consumer is how you undo it.

Restart the consumer's dev server after a sync. Next caches `node_modules`
under both bundlers and will keep serving the previous build otherwise.

Sync is for iterating. Once a change is settled, release it — a consumer whose
behaviour depends on an unreleased sync is broken for everyone else.

## Releasing

```sh
yarn release   # bump -> build -> commit -> tag -> push
```

It refuses to run on a dirty tree, so commit your work first. The bump is part
of releasing rather than a step to remember: consumers pin a tag and yarn
records the commit behind it, so shipping new code under an existing tag leaves
them on whatever they resolved the first time.

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

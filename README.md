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
| `./tokens.css` `./type.css` `./prose.css` `./shiki.css` | the style layer | import in this order |

`/rehype` is separate because `source.config.ts` and friends run in bare Node,
where React is not resolvable. Re-exporting it from the root entry drags the
components in and breaks the build with `Cannot find package 'react'`.

## Consuming

```jsonc
// package.json
"@supertype/foundations": "file:../foundations/supertype-foundations-0.1.0.tgz"
```

Install the packed tarball, not `file:` on the directory — that copies the
package's own `node_modules`, which ships a second `@types/react` and produces
type errors that name neither package. Never `yarn link` either: Turbopack
resolves the symlink to a path outside the project root and the dev server dies
on the CSS import.

```css
/* app/global.css — order matters */
@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";
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

## Releasing

```sh
yarn release   # builds, then packs supertype-foundations-<version>.tgz
```

Bump the version every time. yarn caches tarballs by path, so a stable filename
means consumers silently keep the old code — and a changed file at a stable path
fails yarn's integrity check on the next install.

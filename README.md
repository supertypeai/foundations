# @supertype.ai/foundations

[![ci](https://github.com/supertypeai/foundations/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/supertypeai/foundations/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40supertype.ai%2Ffoundations?logo=npm&color=cb3837)](https://www.npmjs.com/package/@supertype.ai/foundations)
[![license](https://img.shields.io/npm/l/%40supertype.ai%2Ffoundations?color=blue)](LICENSE)

[The foundations philosophy](https://supertypeai.github.io/foundations/philosophy/) explains the reasoning in more detail, but the short version is simple: this is a reusable design system for typography primitives, content blocks, the long-form essay shell, token and theme CSS, and the build-time tooling that keeps the baseline consistent. That includes SEO, OG cards, lint rules, and contrast checks.

It is used in Supertype projects like [Viably work operating system](https://viably.app) and [supertype.ai](https://supertype.ai), and it is MIT-licensed for any Next.js 15+ app built on Tailwind and Shadcn.

```sh
yarn add @supertype.ai/foundations
```

**Start here:** [Install](#install), then [Your first page](#your-first-page).

**Reference:** [Typography](docs/typography.md) · [Blocks](docs/blocks.md) ·
[The essay shell](docs/essay.md) · [Build-time tooling](docs/tooling.md) ·
[The CLI](docs/cli.md)

**Working on the package itself:** [Contributing](docs/contributing.md), for
local iteration against a consumer and for releasing.

Like the project? ⭐ Star it on [GitHub](https://github.com/supertypeai/foundations)

## See it running

Check out: [the documentation site](https://supertypeai.github.io/foundations/), or alternatively run the example site locally:

```sh
yarn example:install   # once, to install Next, the peers and the package
yarn example           # then open http://localhost:3000
```

[`examples/site`](examples/site) renders every component with the code next to it, and includes whole-page [recipes](examples/site/app/_recipes) you can copy into your project. It also includes the `dark` and `.editorial` switches.

## Initialization and Diagnostics

This package includes a CLI that writes the CSS for you and checks the rest:

```sh
npx @supertype.ai/foundations init      # edits your CSS entry, prints the rest
npx @supertype.ai/foundations doctor    # checks this app against everything below
```

`init` edits one file: the CSS entry that imports Tailwind. It adds the imports
you are missing and reorders anything that is out of place. Run it with `--dry-run` first to preview the patch. Everything else it prints for you to paste is the font binding and the `llms.txt` lines for a coding agent.

The steps performed by `init` are written out below anyway. See [the CLI](docs/cli.md) for the full list of checks and details.

### 1. Add the package

```sh
yarn add @supertype.ai/foundations
# or: npm install @supertype.ai/foundations
```

Peers are **Tailwind 4+**, React 19+, Next 15+, `next-view-transitions` 0.3+ and
`@base-ui/react` 1.4+.

**Tailwind v4 is required, not preferred.** `tokens.css` declares
`@custom-variant` and `@theme inline`, and the `@source` line below is v4-only
syntax; on v3 they are parse errors. If you are still on v3, run
[`npx @tailwindcss/upgrade`](https://tailwindcss.com/docs/upgrade-guide) first —
`foundations init` will tell you so rather than writing a block your build
cannot parse.

<details>
<summary>Installing from a git tag instead</summary>

Every release is tagged and published, so a commit can be installed directly
when you want to try an unreleased fix. Pin a tag rather than `#main`: an
untagged git dependency resolves to a different commit on a fresh install.

```jsonc
// package.json
"@supertype.ai/foundations": "https://github.com/supertypeai/foundations.git#v0.1.37"
```

</details>

### 2. Import the CSS

```css
/* app/globals.css */
@import "tailwindcss";
@import "@supertype.ai/foundations";
```

That one line carries `tokens.css`, `theme.css`, `type.css` and `prose.css` in
the order the cascade needs, and registers the package&rsquo;s own `@source` so
Tailwind scans the components it ships. There is no path for you to work out and
no order for you to keep: Tailwind v4 resolves `@source` relative to the file
that declares it, so the package points at its own `dist/`, correctly, wherever
it happens to be installed.

Add `@import "@supertype.ai/foundations/shiki.css";` after it only if you render
code fences.

<details>
<summary>Importing the parts separately</summary>

The granular entry points are still exported and still supported, for the app
that paints every colour role itself and wants `tokens.css` without `theme.css`.
Taking them means owning the order and the scan path yourself:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css"; /* structural tokens + dark variant */
@import "@supertype.ai/foundations/theme.css"; /* the house palette */
@import "@supertype.ai/foundations/type.css"; /* the type ramp + font roles */
@import "@supertype.ai/foundations/prose.css"; /* inline-code rule */

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
```

**The `@source` line is required in this form.** Tailwind does not scan
`node_modules` by default, so without it the package&rsquo;s classes get purged
and the components render without styles. The path is relative to your CSS file,
so it changes with your layout — and in a workspace, where the package hoists to
the repo root, `../node_modules` is not where it lives.

**`theme.css` is required.** `tokens.css` names the colour roles, and
`theme.css` gives them values. Without it, the colour utilities cannot be
resolved, so the page renders unpainted without an obvious error. It also
carries `--secondary-ink`, `--subtle-foreground`, the four earth tones used
for marker highlights, and the `accordion-down` and `accordion-up` keyframes.
Skip it only if you declare every role yourself; `foundations doctor` fails if
neither path is true.

</details>

### 3. Bind the fonts

The package cannot load the typefaces for you. `next/font` runs in your app and
generates hashed variable names at build time, so each app loads the three fonts
and binds them to the roles `type.css` expects:

```tsx
// app/layout.tsx
import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

<html className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans`}>
```

**Bind with `.variable`, never `.className`.** A className sets `font-family`
on the element itself and leaves the roles unresolved, which causes a mismatch
where the page renders one typeface while the `font-sans` and `font-heading`
utilities render another.

### 4. Check the wiring

```sh
npx foundations doctor
```

It reads your CSS entry, your root layout and the installed tree, then reports
on import order, the `@source` path, the font bindings and the peer versions. It
exits non-zero on a real problem, so it works as a CI step too. Every check and
what it catches is listed in [the CLI](docs/cli.md).

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
} from "@supertype.ai/foundations";
import { Card, Cards, Callout } from "@supertype.ai/foundations/blocks";

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

      <TypographyH2 divider className="mt-12">
        Approaches
      </TypographyH2>

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
        fills the disk — see{" "}
        <TypographyLink href="/ops/slots" addArrow>
          slot hygiene
        </TypographyLink>
        .
      </Callout>

      <TypographyCaption as="p" className="mt-8">
        Last reviewed March 2026
      </TypographyCaption>
    </main>
  );
}
```

Two rules cover most of the API:

- **Do not write type styles by hand.** A paragraph carrying
  `text-sm text-muted-foreground` is `<TypographyMuted>`. Using the primitives
  keeps a size and a colour from drifting apart across a few hundred call sites.
- **Retune with CSS variables, not classes.** The package owns its own
  classnames. Change a `--text-*`, `--heading-weight`, or a colour specification in `theme.css` to retune the whole package. Read [Tokens and theming](#tokens-and-theming) for full instructions.

---

## The example site

`yarn example` (above) builds the package, syncs it in and starts the dev
server. `yarn example:build` is what CI would run.

It installs the package from a git tag rather than from the registry and updates
it with `yarn sync`.

`/recipes` holds whole pages rather than single components: a marketing hero, a
metrics panel, pricing tiers, a docs page, an article index, and examples of MDX-rendered pages. Each one lives in
[`app/_recipes/`](examples/site/app/_recipes) as a complete file that imports
only from this package, so you can paste it into your app and it compiles.

---

## For coding agents

The package includes an `llms.txt` with the public API, the rules, and the
mistakes that do not produce an error. Point your agent at it once and it stops
writing `text-sm text-muted-foreground` where a primitive already exists:

```md
<!-- CLAUDE.md, AGENTS.md, or your agent's equivalent -->

@node_modules/@supertype.ai/foundations/llms.txt
```

`yarn build` fails if an export is missing from it, so it cannot fall behind the
package.

---

## Entry points

| import                                                                | contains                                                                 | docs                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| `@supertype.ai/foundations`                                           | all typography primitives, `cn`                                          | [Typography](docs/typography.md)             |
| `@supertype.ai/foundations/blocks`                                    | `Button`, `Badge`, `Card`, `Callout`, `Steps`, `TabGroup`, `Accordion`, `SEGMENT` | [Blocks](docs/blocks.md)                     |
| `@supertype.ai/foundations/mdx`                                       | `proseMdxComponents` — the MDX element map                               | [In MDX](docs/blocks.md#in-mdx)              |
| `@supertype.ai/foundations/essay`                                     | the long-form shell, TOC, reading rail, post meta                        | [Essay](docs/essay.md)                       |
| `@supertype.ai/foundations/seo`                                       | `createSeo(...)` — metadata + JSON-LD                                    | [Tooling](docs/tooling.md#seo-and-og-images) |
| `@supertype.ai/foundations/og`                                        | `ogCard`, `OG_SIZE` — an element for `next/og`                           | [Tooling](docs/tooling.md#seo-and-og-images) |
| `@supertype.ai/foundations/eslint`                                    | the design rules as ESLint selectors                                     | [Tooling](docs/tooling.md#lint-rules)        |
| `@supertype.ai/foundations/rehype`                                    | `rehypeProseCode` — **build-time only**                                  | [In MDX](docs/blocks.md#in-mdx)              |
| `@supertype.ai/foundations/contrast`                                  | token resolution + legibility checks, build-time only                    | [Tooling](docs/tooling.md#contrast-checks)   |
| `./tokens.css` `./theme.css` `./type.css` `./prose.css` `./shiki.css` | the style layer                                                          | [Tokens and theming](#tokens-and-theming)    |
| `foundations` (bin)                                                   | `init` and `doctor`                                                      | [The CLI](docs/cli.md)                       |

---

## Tokens and theming

`tokens.css` names the structural roles and nothing else: `--background`,
`--foreground`, `--card`, `--muted`, `--primary`, `--border` and `--ring`, plus
the status set. They are named for meaning rather than hue, so a project that
renders `success` in blue still reads correctly. It holds no values, so there is
only ever one palette in play.

Each status hue ships twice, on the same rule as the categorical tints:
`--success`, `--warn` and `--info` are **fills**, held to 3:1 against the page
and a card; `--success-ink`,
`--warn-ink` and `--info-ink` are the same hues as **text**, held to 4.5:1.
`--danger` ships as an ink only. `--destructive` keeps shadcn's shape, where
`--destructive-foreground` is the label printed on the fill — that is what
`-foreground` means throughout, and `-ink` means the hue used as words.
`checkSignals` in `@supertype.ai/foundations/contrast` measures all of them and fails if any are below the threshold.

`tokens.css` also binds the `dark:` variant to the `.dark` class. Do not skip
that import: Tailwind v4 otherwise follows the OS setting and quietly ignores
your toggle.

`theme.css` gives those roles the latte and espresso palette, and adds the
editorial inks (`--secondary-ink`, `--subtle-foreground`, and the ochre,
terracotta, sage and fig pairs) along with the elevation shadows.

**No brand colours in the package.** Structural tokens only, with brand colours
left to the app. To repaint, override the raw variables after the imports rather
than patching the utilities:

```css
:root {
  --primary: hsl(24 60% 42%);
}
.dark {
  --primary: hsl(24 70% 62%);
}
```

### `.editorial`

`type.css` names three font roles (`--font-sans`, `--font-mono` and
`--font-heading`) and the weight that goes with the heading face. `.editorial`
gives the heading role to the serif and drops the weight to 400.

```tsx
<div className="editorial">…</div>   {/* or on <html> for an editorial site */}
```

Heading sizes are a _ratio_ to the body text under them, and the two
surfaces set body at different sizes: 13px in the product, 18px on `.editorial`. Scope the class to whichever surfaces should be editorial, whether that is a marketing and docs section or the whole site.

---

## Design rules

1. **The package owns its final classnames.** Retune with CSS custom properties
   (the `--text-*`, `--heading-weight`, the colour tokens) rather than by
   patching classes. A property the package declares is read by the package —
   `test/tokens-live.test.ts` fails on one that is not, because a knob that
   turns nothing is worse than no knob at all.
2. **No variant props on the MDX map.** Elements that MDX renders automatically
   take no options, because there is no call site to make the choice. Components
   you invoke by hand can have variants.
3. **Use the platform first, and a library only where it falls short.**
   `Disclosure` is a `<details>`/`<summary>` pair: no JavaScript, correct before
   hydration, and available to an MDX author. `Accordion` and `Tabs` use Base UI,
   since animation and managed selection are beyond what the platform gives you.
4. **No brand colours.** Structural tokens only, with brand colours left to the
   app.
5. **Put structure in CSS rather than the component map.** A host framework can
   substitute its own element and strip the classes off it, but it cannot strip a
   child combinator. Both the Shiki theming and the inline-code rule rely on
   this.

---

## In production

Sites running the package:

- [supertype.ai](https://supertype.ai) — Supertype, a regional-leading analytics engineering and data science consulting firm.
- [viably.app](https://viably.app) — Viably, an observability-first business operating system and CRM for automation-obsessed teams.

## ![](https://assets.viably.app/app_assets/screen/usage_dark.webp)

## License

MIT. Copyright © 2026 Supertype. See [LICENSE](LICENSE).

Published to npm as
[`@supertype.ai/foundations`](https://www.npmjs.com/package/@supertype.ai/foundations),
and installable from this repository by tag. The MIT grant covers using,
modifying and redistributing it either way.

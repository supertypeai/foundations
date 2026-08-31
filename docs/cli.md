[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md)

---

# The CLI

Most of what this package needs from an app fails quietly when it is missing.
A missing `@source` line purges every class the package ships, so the components
render unstyled. A skipped `theme.css` leaves every colour role unpainted, so
`bg-background` resolves to nothing. A font bound with `.className` renders one
typeface on
`<html>` and another on every utility that asks for a role. None of them throw
an error you can search for.

They are all easy enough to check mechanically:

```sh
npx foundations init      # add and reorder the CSS imports, print the rest
npx foundations doctor    # check this app against what the package expects
```

Run both from the root of your app. `yarn foundations …` works too, since the
bin is linked on install.

## `init`

Finds the CSS file that imports Tailwind and fixes it up:

```sh
npx foundations init
```

```
✔ patched app/global.css
    @import "@supertype.ai/foundations/tokens.css";
  + @import "@supertype.ai/foundations/theme.css";
    @import "@supertype.ai/foundations/type.css";  /* the type ramp */
    @import "@supertype.ai/foundations/prose.css";
  + @source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
```

It adds what is missing and reorders what is out of order, since the imports are
a cascade and a later file re-points variables an earlier one defines. Lines you
already wrote get moved rather than rewritten, so a trailing comment stays with
its import, and the rest of the file is left alone.

The `@source` path is worked out from where the package is actually installed,
so it is right under yarn's hoisting and in a monorepo where `node_modules` sits
somewhere else. `shiki.css` is not added, since an app that renders no code
fences does not need it.

Running it twice does nothing. Use `--dry-run` to see the patch without writing.

Fonts are the one part it cannot do for you: `next/font` runs in your app and
generates its variable names at build time, so `init` finishes by printing the
binding to paste into your root layout.

## `doctor`

```sh
npx foundations doctor
```

Exits `1` if something is broken and `0` otherwise, so it works as a CI step.
The markers are `✔` fine, `·` optional, `!` works but degrades, `✖` broken.

### Install

| check | what it catches |
|---|---|
| the dependency is pinned | a `#main` or untagged git dependency re-resolves to a different commit on any fresh install. A registry range is pinned by the lockfile, so it is not checked |
| installed version matches the tag | an unreleased `yarn sync`, which is fine to iterate against but not to ship against |
| not a symlink | `yarn link` gives you two copies of React (invalid hook call) and a path outside the project root that Turbopack fails on |
| `dist/` is present | the package ships built, so a missing `dist/` means a broken install rather than a failed compile |
| no nested React | two copies of React show up as an invalid hook call at runtime |
| peers satisfy their ranges | `@base-ui/react` is only a warning, since just `Accordion` and `Tabs` need it |

### Styles

| check | what it catches |
|---|---|
| a CSS entry importing `tailwindcss` exists | nothing else can be checked without one |
| every required entry point is imported | `tokens.css`, `type.css` and `prose.css` are structural; `theme.css` is the palette, and doctor names the roles left unpainted without it |
| the imports are in order | a later file re-points variables the earlier one defines |
| `@source` is present and resolves | the loudest failure of the lot: without it Tailwind never scans the package and every class is purged |
| no second `@custom-variant dark` | `tokens.css` already binds `dark:` to `.dark`, and with two declarations the later one wins |

### Contrast

`doctor` expands the package imports in your CSS entry and measures the palette
that actually results, in both themes. A structural ink that cannot be read on
its surface is an error — that is a broken page, not a styling opinion. A fill
under 3:1 or a tinted ink under 4.5:1 is a warning, because the palette is yours.

| check | what it catches |
|---|---|
| every structural ink clears 4.5:1 on every surface | an override that ties on specificity repaints both themes — a `.dark` block measuring 15.7:1 while the page renders white on white |
| every fill clears 3:1 on the page and on a card | a status dot or a chart bar that cannot be picked out of its background |
| every tinted ink clears 4.5:1, every label clears 4.5:1 on its own fill | a hue tuned as a mark and then used as words |
| `--subtle-foreground` clears the 3:1 it is documented for | a tertiary ink quietly promoted to body copy by a theme override |
| every hairline clears 1.4:1 on the page and on a card | a border retinted in one theme and left faint in the other |

### Fonts

| check | what it catches |
|---|---|
| every role variable is bound | an unbound role falls back to a generic typeface. `--font-average` is only informational until something on the site uses `.editorial` |
| bound with `.variable`, not `.className` | the page renders one typeface while every `font-sans` and `font-heading` utility renders another |

The variables it looks for come from the installed `type.css`, and the peer
ranges from the installed `package.json`, so the checks stay in step with the
package they ship with.

## Options

| flag | |
|---|---|
| `--cwd <dir>` | run against another app instead of the current directory |
| `--dry-run` | `init` only: print the patch without writing it |
| `NO_COLOR=1` | plain output, which is also the default when stdout is not a TTY |

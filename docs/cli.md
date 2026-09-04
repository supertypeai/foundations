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
✔ patched app/globals.css
  + @import "@supertype.ai/foundations";
```

That is the whole patch. The package registers its own `@source` and imports its
own files in order, so the path and cascade are already handled — see [Import
the CSS](../README.md#2-import-the-css). `shiki.css` is not added, since an app
that renders no code fences does not need it.

An app already on the granular form is repaired rather than rewritten: `init`
adds what is missing, reorders what is out of order, and computes the `@source`
path from where the package is actually installed — right under yarn's hoisting
and in a workspace where `node_modules` sits at the repo root. Lines you already
wrote get moved rather than rewritten, so a trailing comment stays with its
import. It then mentions that the block can collapse to one line, and leaves the
choice to you.

Running it twice does nothing. Use `--dry-run` to see the patch without writing.

The entry is searched for from the root of your app rather than in a fixed list
of directories, in `.css`, `.pcss`, `.postcss` and `.scss`, and in both Tailwind
dialects — so an app on v3, or one that keeps its stylesheet somewhere other
than `app/`, is told what is actually wrong instead of being told it has no
stylesheet. If more than one file imports Tailwind, the shallowest wins.

On Tailwind v3, `init` writes nothing and says so: the block it would add is
v4-only syntax, so patching would trade a building app for a parse error.

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

| check                             | what it catches                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tailwind is v4                    | `tokens.css` needs `@custom-variant` and `@theme inline`, and `@source` is v4-only. This is the one peer whose absence breaks every other check, so it is reported before them |
| the dependency is pinned          | a `#main` or untagged git dependency re-resolves to a different commit on any fresh install. Registry ranges are pinned by the lockfile, so this check does not run            |
| installed version matches the tag | an unreleased `yarn sync`, which is fine to iterate against but not to ship against                                                                                            |
| not a symlink                     | `yarn link` gives you two copies of React (invalid hook call) and a path outside the project root that Turbopack fails on                                                      |
| `dist/` is present                | the package ships built, so a missing `dist/` means a broken install rather than a failed compile                                                                              |
| no nested React                   | two copies of React show up as an invalid hook call at runtime                                                                                                                 |
| peers satisfy their ranges        | `@base-ui/react` is only a warning, since just `Accordion` and `Tabs` need it                                                                                                  |

### Styles

| check                                      | what it catches                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a CSS entry importing Tailwind exists      | nothing else can be checked without one. Both dialects count, so a v3 app is diagnosed rather than reported as having no stylesheet                           |
| that entry is v4                           | on v3 every check below fails for one upstream reason, so `doctor` reports the reason and stops                                                               |
| the style layer is imported after Tailwind | on the single import that is the only thing left to get wrong, since the package owns the order and the scan path                                             |
| every required entry point is imported     | granular form only: `tokens.css`, `type.css` and `prose.css` are structural; `theme.css` is the palette, and doctor names the roles left unpainted without it |
| the imports are in order                   | granular form only: a later file re-points variables the earlier one defines                                                                                  |
| `@source` is present and resolves          | granular form only, and the loudest failure of the lot: without it Tailwind never scans the package and every class is purged                                 |
| no second `@custom-variant dark`           | `tokens.css` already binds `dark:` to `.dark`, and with two declarations the later one wins                                                                   |

### Contrast

`doctor` expands the package imports in your CSS entry and measures the palette
that actually results, in both themes. A structural ink that cannot be read on
its surface is an error — that is a broken page, not a styling opinion. A fill
under 3:1 or a tinted ink under 4.5:1 is a warning; the palette is yours to fix.

| check                                                                   | what it catches                                                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| every structural ink clears 4.5:1 on every surface                      | an override that ties on specificity repaints both themes — a `.dark` block measuring 15.7:1 while the page renders white on white |
| every fill clears 3:1 on the page and on a card                         | a status dot or a chart bar that cannot be picked out of its background                                                            |
| every tinted ink clears 4.5:1, every label clears 4.5:1 on its own fill | a hue tuned as a mark and then used as words                                                                                       |
| `--subtle-foreground` clears the 3:1 it is documented for               | a tertiary ink quietly promoted to body copy by a theme override                                                                   |
| every hairline clears 1.4:1 on the page and on a card                   | a border retinted in one theme and left faint in the other                                                                         |

### Fonts

| check                                    | what it catches                                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| every role variable is bound             | an unbound role falls back to a generic typeface. `--font-average` is only informational until something on the site uses `.editorial` |
| bound with `.variable`, not `.className` | the page renders one typeface while every `font-sans` and `font-heading` utility renders another                                       |

The variables it looks for come from the installed `type.css`, and the peer
ranges from the installed `package.json`, so the checks stay in step with the
package they ship with.

## Options

| flag          |                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `--cwd <dir>` | run against another app instead of the current directory. May be given before or after the command |
| `--dry-run`   | `init` only: print the patch without writing it                                                    |
| `NO_COLOR=1`  | plain output, which is also the default when stdout is not a TTY                                   |

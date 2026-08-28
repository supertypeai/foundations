[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md)

---

# The CLI

Most of what this package needs from an app fails quietly when it is missing.
A missing `@source` line purges every class the package ships, so the components
render unstyled. A skipped `theme.css` leaves the marker tones and the accordion
keyframes undefined. A font bound with `.className` renders one typeface on
`<html>` and another on every utility that asks for a role. None of them throw
an error you can search for.

They are all easy enough to check mechanically:

```sh
npx foundations init      # write the CSS block, print the font binding
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
    @import "@supertype/foundations/tokens.css";
  + @import "@supertype/foundations/theme.css";
    @import "@supertype/foundations/type.css";  /* the type ramp */
    @import "@supertype/foundations/prose.css";
  + @source '../node_modules/@supertype/foundations/dist/**/*.js';
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
| the dependency is pinned | a `#main` or untagged git dependency re-resolves to a different commit on any fresh install |
| installed version matches the tag | an unreleased `yarn sync`, which is fine to iterate against but not to ship against |
| not a symlink | `yarn link` gives you two copies of React (invalid hook call) and a path outside the project root that Turbopack fails on |
| `dist/` is present | the package ships built, so a missing `dist/` means a broken install rather than a failed compile |
| no nested React | two copies of React show up as an invalid hook call at runtime |
| peers satisfy their ranges | `@base-ui/react` is only a warning, since just `Accordion` and `Tabs` need it |

### Styles

| check | what it catches |
|---|---|
| a CSS entry importing `tailwindcss` exists | nothing else can be checked without one |
| every required entry point is imported | `tokens.css`, `type.css` and `prose.css` are structural; `theme.css` is a warning, and the components that need it break quietly |
| the imports are in order | a later file re-points variables the earlier one defines |
| `@source` is present and resolves | the loudest failure of the lot: without it Tailwind never scans the package and every class is purged |
| no second `@custom-variant dark` | `tokens.css` already binds `dark:` to `.dark`, and with two declarations the later one wins |

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

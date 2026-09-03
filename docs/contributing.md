[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md)

---

# Working on the package

## Local iteration

Consumers pin a git tag, which is right for anything that ships and wrong for the
ten-minute loop of nudging a value and looking at it. `yarn sync` closes that
loop without a tag:

```sh
yarn sync        # build, then copy into each consumer's node_modules
yarn dev:sync    # same, on every save under src/
```

It writes to `node_modules/@supertype.ai/foundations` in `ssite` and
`viably/on_next`, looked up under `~/fun` (pass paths as arguments
for anywhere else). Nothing else changes: the consumer's `package.json` and
lockfile still name the tag, so CI and production install what they did before,
and running `yarn install` there undoes the sync.

Restart the consumer's dev server after a sync. Next caches `node_modules` under
both bundlers and will keep serving the previous build otherwise.

Do not use `yarn link`. Turbopack resolves the symlink to a path outside the
project root and the dev server fails on the CSS import, and you end up with two
copies of React, which shows up as an invalid hook call at runtime.

Sync is for iterating. Once a change has settled, release it: a consumer that
depends on an unreleased sync is broken for everyone else.

## The example site

`examples/site` renders the whole surface, and doubles as a smoke test for the
install instructions: it installs the package from a git tag like a real
consumer, so a README that stops being true stops rendering.

```sh
yarn example:install   # once — installs the tag, plus Next and the peers
yarn example           # build, sync, then the dev server
yarn example:build     # what CI would run
```

`yarn example` goes through the same `yarn sync` the real consumers use, so the
app always shows your working tree rather than the tag it installed.

Demos live in `examples/site/app/_demos/` as complete files, and `<Demo>` reads
each one off disk to display it, so the code on the page cannot drift from the
code that rendered the preview. A new component needs a demo file and one
`<Demo source="…">` on the relevant page.

Recipes use the same mechanism at page scale, in `app/_recipes/`: a whole page
someone can paste into their app. They have one rule — import only from
`@supertype.ai/foundations`, with no relative imports and no `@/` alias — because a
recipe that reaches for a helper from the example site will not compile once it
is copied out. `scripts/check-recipes.mjs` runs as `prebuild` and fails the
build if one does. If a file genuinely needs a local helper, put it in
`_demos/`.

## The CLI

`bin/foundations.mjs` is the consumer-side `init` and `doctor`. It reads what to
expect from the installed package instead of hardcoding it: CSS entry points
from `exports`, font variables from `type.css`, peer ranges from
`peerDependencies`. A rule that changes in the package changes there on the next
release. Keep it that way, otherwise the checks drift from what they are
checking.

Test it against a real app, not this repo (it refuses to run on itself):

```sh
node bin/foundations.mjs doctor --cwd ~/fun/ssite
```

## Tests

```sh
yarn test          # builds, then runs the suite against dist/
yarn test:watch    # vitest, no rebuild
```

The suite runs against `dist/` rather than `src/`, since `dist/` is what
consumers install and what the repo commits. `yarn release` runs `yarn
test` in place of `yarn build`, so a failing suite stops a tag going out.

Four kinds of test, in `test/`:

- **`cli.test.ts`** spawns `bin/foundations.mjs` against throwaway fixture apps
  built by `test/fixtures/app.ts`. The CLI reads what to expect from its own
  location, so a fixture only needs a package.json, a CSS entry, a layout and a
  stub `node_modules`. Both CLI bugs found so far — a `@custom-variant` inside a
  comment counting as a declaration, and a comment-stripping regex eating the
  `/**/` out of the `@source` glob — have a test here.
- **`contrast.test.ts`**, **`essay-toc.test.ts`**, **`eslint-rules.test.ts`**
  cover the modules with no React in them. `checkLegibility` is run over the
  package's own `tokens.css` and `theme.css`, so a token change that makes text
  unreadable fails the build.
- **`types.test.ts`** runs `tsc -p tsconfig.typetest.json` over `test/types/`.
  Every `@ts-expect-error` there asserts that the line below it does _not_
  compile. If a preset stops pinning its prop, TypeScript reports the directive
  as unused and the test fails.

There are no render tests yet. Adding them means happy-dom and a stub for
`next-view-transitions`, which nothing has needed so far.

## llms.txt

`llms.txt` is the API summary consumers point their coding agents at. It is
written by hand, because the useful part is the guidance — which component to
reach for, and which mistakes produce no error — rather than a list of names.

What does rot is coverage, so `scripts/check-llms.mjs` checks it against the real
exports of every entry point (via the TypeScript compiler, not a regex) and runs
as the last step of `yarn build`. Adding a component means adding it to the entry
points table, and to the lookup table if an app would reach for it directly.

## Releasing

```sh
yarn release   # bump -> build -> commit -> tag -> push -> npm publish
```

It refuses to run on a dirty tree, so commit your work first. It also checks
`npm whoami` before building anything: an unauthenticated publish would
otherwise fail at the last step, with the tag already pushed and no version
behind it. The version bump is part of releasing rather than a separate step you
have to remember: `npm publish` refuses a version it has already seen, and a
consumer pinning the git tag records the commit behind it, so shipping new code
under an existing version leaves them on whatever they resolved the first time.

The tag and the registry version are the same commit because one command makes
both. Publishing by hand is what breaks that, so don't: `npm publish` on its own
skips the bump, the tag and the pin rewrite.

`dist/` is tracked deliberately, so do not re-add it to `.gitignore`.
`yarn release` always rebuilds before staging, so the committed output stays in
step with the source as long as releases go through it.

Then repoint each consumer and commit its lockfile:

```sh
yarn add @supertype.ai/foundations            # from the registry
yarn add "@supertype.ai/foundations@https://github.com/supertypeai/foundations.git#v<version>"  # or the tag
```

# The example site

Every component the package ships, rendered next to the source that produced it,
with switches for the two surfaces (`dark` and `.editorial`) that a markdown file
cannot show you.

```sh
yarn example:install   # once, from the repo root
yarn example           # builds the package, syncs it in, starts the dev server
```

Then http://localhost:3000.

## How it consumes the package

This app installs `@supertype.ai/foundations` from a git tag, the same way `ssite`
and `viably` do, and `yarn example` copies the local build over the installed
copy using the same `yarn sync` those two use. No workspace and no `yarn link`,
because a symlink gives you two copies of React and a path outside the project
root — the failure the README warns about. An example that skips the install
contract cannot check it.

So `app/global.css` is the README's install block unchanged, and
`app/layout.tsx` is the README's font binding unchanged. If either drifts from
the docs this app stops rendering correctly, which is the point of keeping it
here. `npx foundations doctor --cwd examples/site` passes for the same reason.

## The demos are the code

`app/_demos/*.tsx` are real, complete files you can copy. The `<Demo>` component
reads each one off disk with `readFileSync` and highlights it, so the code shown
on the page is the file that rendered the preview above it. Nothing is retyped
into a string, which is how these galleries usually start lying.

To add one: write the file in `app/_demos/`, import it into a page, and point
`<Demo source="app/_demos/your-file.tsx">` at it.

## Recipes are the same idea at page scale

`app/_recipes/` holds whole pages — a marketing hero, a metrics panel, pricing
tiers, a docs page, an article index — for copying rather than for studying one
component at a time. They render on `/recipes` through the same `<Demo>`.

One rule separates a recipe from a demo: **a recipe imports only from
`@supertype.ai/foundations`.** No relative imports, no `@/` alias, nothing that
lives in this site. A file that reaches for a local helper will not compile once
someone pastes it into their own app. `yarn check:recipes` enforces this and
`prebuild` runs it, so `yarn build` fails rather than shipping a recipe that
cannot be copied.

/**
 * `next-view-transitions` imports `next/link`, which resolves through a bundler
 * and not through Node. The suite runs in plain Node, so a module that only
 * needs the *identity* of `Link` — `resolveLink` returns it, it is never
 * rendered here — gets this instead. Aliased in vitest.config.ts.
 */
export const Link = "a";

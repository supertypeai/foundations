export { cn } from "./cn.js";
export * from "./typography/index.js";

// NOTE: blocks, the MDX map, and the Shiki plugin are all deliberately absent
// from this barrel.
//
// A barrel's transitive dependencies are paid by every name it exports. mdx.tsx
// imports `next/image`, and a bare subpath like that fails to resolve from
// inside node_modules under a plain Node ESM loader — which is what a consumer's
// test runner uses. Pulling it in here made every test that touches a Typography
// component fail to import.
//
// blocks/ carries the same hazard one dependency over: interactive-accordion.tsx
// and tabs.tsx pull `@base-ui/react`, so re-exporting them made a bare
// `import { TypographyH2 }` resolve Base UI. They live at
// "@supertype/foundations/blocks" for that reason, not for tree-shaking — the
// bundlers already handle that.
//
// What the split does NOT buy is a plain-Node-importable root. Measured, not
// assumed: `node -e "import('@supertype/foundations')"` from a consumer fails on
// ERR_MODULE_NOT_FOUND for next/link, because TypographyLink imports
// `next-view-transitions`, whose dist/index.js:3 imports `next/link` — the same
// unresolvable bare subpath as next/image above, one package further out. The
// blocks entry fails identically through card.tsx.
//
// This is survivable because the runner that matters resolves it: both consumers'
// vitest suites import typography freely and pass. Do not "fix" it by reinstating
// injection — that was tried, and paragraph.tsx documents the call site it
// silently left unbound. Isolating it would mean a /next subpath for
// TypographyLink and Card, against ~230 and ~100 call sites.
//
// The Shiki plugin has build-time consumers (source.config.ts, next.config) that
// run in bare Node where React is not resolvable. Import it from
// "@supertype/prose/rehype".

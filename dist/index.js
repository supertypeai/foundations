export { cn } from "./cn.js";
export * from "./typography/index.js";
export { createProseMdxComponents } from "./mdx.js";
export * from "./blocks/index.js";
// NOTE: the Shiki plugin is deliberately NOT re-exported here.
// This entry pulls in the React components, and build-time consumers
// (source.config.ts, next.config) run in bare Node where React is not
// resolvable. Import it from "@supertype/prose/rehype".

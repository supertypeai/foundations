export { cn } from "./cn.js";
// The semantic colour vocabulary. Exported from the root because typography
// takes it too: a link has a tone, drawn from the same seven a button has.
// `toneClass` only: the raw table and its derived half used to ship separately,
// and the order they were combined in was load-bearing.
export { toneClass, impliedTone, INK_ON_FILL, INK_ON_CARD, INK_ON_POPOVER, INK_ON_SIDEBAR, inkOnSurfaceStyle, } from "./tone.js";
// Where an href goes, for the rare call site that styles someone else's element
// and cannot render a Card/Button/TypographyLink — the same pairing with
// `buttonVariants`. Prefer passing `href` to a component over calling this.
export { resolveLink, isExternalHref, } from "./href.js";
export * from "./typography/index.js";
// blocks, the MDX map and the Shiki plugin are deliberately absent: a barrel's
// transitive dependencies are paid by every name it exports, and mdx.tsx reaches
// `next/image` while blocks/ pulls `@base-ui/react`. Do not "fix" the remaining
// Next dependency by reinstating injection, which left one call site unbound.

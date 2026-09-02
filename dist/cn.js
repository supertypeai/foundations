import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
/**
 * `text-h1`…`text-h4` are this package's rungs, declared in type.css as
 * `--text-h1`…`--text-h4`. tailwind-merge has never heard of them.
 *
 * Faced with a `text-*` it does not know, it has to pick a class group, and
 * `h3` matches neither a t-shirt size nor an arbitrary value — so it falls
 * through to `text-color`, which accepts any token. tailwind-merge therefore
 * believed `text-h3` was a colour, and deleted whichever colour stood beside
 * it. Measured, not assumed:
 *
 *   twMerge("text-red-500 text-h3")  →  "text-h3"          // collided
 *   twMerge("text-sm text-h3")       →  "text-sm text-h3"  // did not
 *
 * Which side lost depended on `cva` key order, so it broke in both directions
 * at once. `HEADING_BASE` states the ink before the rung, so every heading on
 * the default variant shipped with no colour class at all and quietly inherited
 * whatever painted above it — which is right on a page and wrong on every
 * surface that hands down an ink, the contract `INK_ON_CARD` and friends exist
 * to keep. `statVariants` orders `size` before `tone`, so a
 * `<TypographyStat size="card" tone="muted">` lost its rung instead and
 * rendered at the inherited size.
 *
 * `text-2xs` and `text-3xs` are custom rungs too and were never affected: they
 * match tailwind-merge's t-shirt-size pattern and land in `font-size` on their
 * own. Only the four heading rungs fall through, which is why this list is
 * exactly four names long.
 *
 * Registering them leaves every real conflict intact — two rungs still collide
 * with each other and with the body ramp, two colours still collide — and stops
 * the one that was never a conflict. test/heading-ink.test.tsx holds it.
 */
const twMerge = extendTailwindMerge({
    extend: { classGroups: { "font-size": [{ text: ["h1", "h2", "h3", "h4"] }] } },
});
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

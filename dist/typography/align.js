/**
 * Lining a mark up with the words beside it, where `items-center` centres line
 * boxes holding leading the string may not use. `CAP_TRIM` shrinks the text to its
 * ink; `ON_FIRST_LINE` grows the mark to one line. Never both on one row.
 */
/**
 * The optical box: cap top to baseline, leading removed. It goes on the text
 * element and shortens it, so a row of trimmed text needs its own height floor.
 * The 0.35em padding and pull must stay equal and opposite, which
 * test/leading-ownership.test.tsx pins.
 */
export const CAP_TRIM = "[text-box:trim-both_cap_alphabetic] pb-[0.35em] -mb-[0.35em]";
/**
 * A box one line tall with the mark centred in it, for a mark belonging to the
 * first line of something taller. It goes on a wrapper, since a height on the
 * mark would stretch the glyph. `1lh` resolves against inherited leading.
 */
export const ON_FIRST_LINE = "flex h-[1lh] shrink-0 items-center";

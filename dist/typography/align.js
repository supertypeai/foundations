/**
 * The optical box: cap top to baseline, leading removed, for a line of text
 * centred in a box of its own or beside an object taller than it: a control's
 * label, an avatar's initials, the words beside an avatar or a progress ring. A
 * glyph beside words is a mark instead. The 0.35em padding and pull must stay
 * equal and opposite, which test/leading-ownership.test.tsx pins.
 */
export const CAP_TRIM = "[text-box:trim-both_cap_alphabetic] pb-[0.35em] -mb-[0.35em]";
/**
 * The one glyph size: a bare glyph is one em of the words beside it. A direct
 * child only, so anything composed (a checkbox and its tick, a wrapper) keeps
 * the size it gives itself. Marks, controls and slots all take this.
 */
export const GLYPH = "[&>svg]:pointer-events-none [&>svg]:size-[1em] [&>svg]:shrink-0";
/**
 * The mark slot: one cap tall, with its baseline at its own bottom edge. Set on a
 * baseline, inline in a run of words or in a baseline row, it seats its centre
 * on the middle of the capitals. The pseudo-element gives it that baseline, and
 * the cap is read from the words around it, so it never needs their size.
 * Nothing here is measured from the line box, so leading and zoom leave it
 * alone. What it holds may be up to a line tall: taller overflows the line.
 */
export const MARK = `inline-flex h-[1cap] shrink-0 items-center align-baseline before:h-full before:self-baseline ${GLYPH}`;

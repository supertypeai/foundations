/**
 * Lining a mark up with the words beside it, from either side.
 *
 * `items-center` centres boxes, and a line box is not the letters: it holds the
 * leading, the ascent and the descent, whatever the string uses of them. There
 * are two ways to close that gap and they apply to opposite elements. `CAP_TRIM`
 * shrinks the text to its ink, for a row whose items are all on one line.
 * `ON_FIRST_LINE` grows the mark to one line, for a row whose text runs on and
 * whose mark belongs to the name at the top of it.
 *
 * Reach for one or the other, never both on the same row.
 */
/**
 * The optical box: cap top to baseline, with the leading either side removed.
 *
 * A line box reserves room for the ascenders and descenders a string may not
 * use, so `items-center` beside an icon centres that reservation rather than
 * the letters. On an 11px uppercase label the mark next to it renders about a
 * pixel low, which is a whole device pixel against an eight pixel cap band.
 * Trimming makes the element as tall as its own ink, so the row centres what
 * the reader actually sees.
 *
 * Two things follow. It goes on the text element, since `text-box` is not
 * inherited and a row cannot hand it down. And it shortens that element, so a
 * row of trimmed text needs a height floor of its own: without one, the card
 * whose label carries no mark sits shorter than the three beside it and its
 * figure rides high. Chrome and Safari trim, and a browser that does not know
 * `text-box` keeps the untrimmed box, which is the behaviour of every consumer
 * today.
 *
 * Safe on a string that clips. The trimmed box ends at the baseline, so on its own
 * `truncate` would shear the tail off every g and p. The padding puts that room back
 * inside the clip box and the negative margin takes it straight out of the layout box
 * again, so the row still centres on cap-to-baseline and nothing is cut. 0.35em is an
 * upper bound on a Latin descender rather than a measurement of one, so it needs no
 * metrics and cannot drift: too small shears a tail where anyone can see it, and too
 * large costs paint room inside a clip box and nothing else. The padding and the pull
 * must stay equal and opposite, which test/leading-ownership.test.tsx pins: on a
 * browser with no `text-box` they cancel, so the box is the untrimmed line box and the
 * row lands exactly where it did before. Nothing degrades, nothing shifts, and no
 * fallback is possible anyway once the metrics table is gone.
 *
 * Vertical padding and margin do nothing on an inline box, so this wants a flex item or
 * a block, which is what `text-box` needs anyway.
 *
 * Uppercase is where it pays. A cap band fills half of an 11px line box and the
 * mark beside it lands a whole device pixel low, where 13px mixed case measures
 * the same trimmed or not: ascenders reach the top of the line box on their own,
 * so there is little leading left to take.
 */
export const CAP_TRIM = "[text-box:trim-both_cap_alphabetic] pb-[0.35em] -mb-[0.35em]";
/**
 * A box one line tall with the mark centred in it, for a mark that belongs to the
 * first line of something taller.
 *
 * The row is `items-start`, so its own height is whatever the text grew to and
 * centring on it would drop the mark into the middle of a paragraph. This gives
 * the mark the first line's height instead, which is the thing it names. It goes
 * on a wrapper rather than the mark: a height on the mark itself would stretch
 * the glyph rather than move it.
 *
 * `1lh` resolves against the wrapper's own inherited leading, so a first line set
 * at a rung the row does not share wants that rung on the wrapper too. The
 * alternative is what this replaces, a top margin holding the mark down by a
 * number that is right at one pairing of rung and mark size and silently wrong at
 * every other.
 */
export const ON_FIRST_LINE = "flex h-[1lh] shrink-0 items-center";

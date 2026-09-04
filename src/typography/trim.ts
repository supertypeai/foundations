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
 * Never on a string that also clips. The bottom edge is the baseline, so
 * descenders sit outside the box, and `truncate` or any other overflow hidden
 * cuts the tails off every g and p in it.
 *
 * Uppercase is where it pays. A cap band fills half of an 11px line box and the
 * mark beside it lands a whole device pixel low, where 13px mixed case measures
 * the same trimmed or not: ascenders reach the top of the line box on their own,
 * so there is little leading left to take.
 */
export const CAP_TRIM = "[text-box:trim-both_cap_alphabetic]";

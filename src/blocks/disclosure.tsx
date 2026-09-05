import { cn } from "../cn.js";
import { FOCUS_RING } from "./focus.js";

/**
 * The disclosure, as one set of surfaces, so the `<details>` pair and the Base UI
 * accordion cannot drift. It is `SEGMENT`'s argument one component over: a reader
 * who opens a row in an MDX FAQ and again in a client-side panel should not have
 * to be told they are the same control.
 *
 * The look is `Tabs`' `line` variant: no box, no fill, a hairline between rows,
 * and one 2px mark in `--tone-hue` naming what is open. Ink carries the state —
 * muted at rest, `--foreground` open — exactly as a tab label does, since an open
 * row is being read rather than signalled.
 *
 * The mark is per row and scales in, where the tab strip's slides. That is the
 * translation, not a shortcut: one tab is active, so its marker can outlive the
 * selection and carry the answer across. Any number of rows can be open at once,
 * and a single element cannot be in two of them.
 *
 * Each engine reports "open" its own way and neither can see the other's: a
 * `<details>` writes `open` on itself, Base UI writes `aria-expanded` on the
 * trigger. Both selectors are spelled out in every string here, and the one that
 * does not apply matches nothing — there is no `group/disclosure` above a Base UI
 * trigger and no `aria-expanded` on a `<summary>`. So one string dresses both,
 * with no branch and no second copy to keep in step. The cost is a class the
 * constant cannot supply for itself: `<details>` carries its state on the
 * ancestor, so `Disclosure` must mark it `group/disclosure` or the rows below go
 * quietly dead.
 *
 * Everything moves on one 200ms ease-out, the tab marker's, because the mark and
 * the ink are one gesture. `transition-colors` alone lands 50ms early and the two
 * halves of the same movement visibly disagree.
 */
export const DISCLOSURE = {
  /**
   * The list. A rule between rows and nothing around them: the group is a set of
   * lines on the page, not a panel sitting on it. `my-6` is the block's own room.
   */
  group: "my-6 flex flex-col",

  /** One row and its panel. A rule after the last would be a floor under the group. */
  item: "not-last:border-b not-last:border-border",

  /**
   * The summary line, its mark, and what both do when the row opens — one string,
   * since no call site has ever wanted the row without its open state.
   *
   * `pl-4` sets the label 14px clear of the 2px mark. The radius is the focus
   * ring's, which is drawn on a full-width row and wants its corners: there is no
   * hover surface here to round, because hover moves the ink and nothing else. A
   * full-width wash is the boxed idiom this look exists to avoid.
   */
  row: cn(
    "group/disclosure-row relative flex w-full cursor-pointer items-center justify-between gap-4",
    "rounded-sm py-3 pl-4 pr-1 text-left text-sm font-medium",
    "text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground",
    FOCUS_RING,
    "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:scale-y-0 before:bg-(--tone-hue)",
    "before:transition-transform before:duration-200 before:ease-out motion-reduce:before:transition-none",
    "group-open/disclosure:text-foreground group-open/disclosure:before:scale-y-100",
    "aria-expanded:text-foreground aria-expanded:before:scale-y-100",
  ),

  /** The body, hung off the label's left edge rather than the mark's. */
  panel: "pb-4 pl-4 pr-1 text-sm text-muted-foreground",
} as const;

/**
 * The one glyph, inline rather than imported — one path is not a dependency — and
 * shared rather than declared twice, which is how the two engines came to disagree
 * about its size. It rotates and is never swapped for a second drawing, since a
 * mark that is replaced cannot animate between states.
 *
 * Its open selectors read the row rather than being handed down, so the classes
 * live here instead of in `DISCLOSURE`: out of a `DISCLOSURE.row` they would
 * match nothing, and a constant that is only correct inside another one is not a
 * surface a caller can use.
 */
export function DisclosureChevron({ className }: { className?: string }) {
  return (
    <svg
      data-slot="disclosure-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        // The tab strip's icon size, and the mark's ink when open, for the reason
        // the active tab's icon takes it.
        "pointer-events-none size-3.5 shrink-0 text-muted-foreground",
        "transition-[transform,color] duration-200 ease-out motion-reduce:transition-none",
        "group-open/disclosure:rotate-180 group-open/disclosure:text-(color:--tone-hue)",
        "group-aria-expanded/disclosure-row:rotate-180 group-aria-expanded/disclosure-row:text-(color:--tone-hue)",
        className,
      )}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

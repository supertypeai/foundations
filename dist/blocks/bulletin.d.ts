import type { ReactNode } from "react";
/** One cell of the grid. `mark` and `ink` are class names, so they can be any
 *  hue the consuming app has: `bg-fern`/`text-fern-ink` from theme.css, or a
 *  token of their own. Both optional — a point with no hue is a plain one. */
export interface BulletinPoint {
    title: ReactNode;
    body: ReactNode;
    /** The dot before the title. A background class: `bg-terracotta`. */
    mark?: string;
    /** The title's ink. A text class: `text-terracotta-ink`. */
    ink?: string;
}
export interface BulletinProps {
    /** `card` is the panel. `line` is the same statement at one line: the accent,
     *  the action and the sentence, with the grid dropped. */
    variant?: "card" | "line";
    /**
     * Drawn along the top edge of the panel, full width, before the padding
     * starts. `<Ribbon />` is the one that ships; a rule, a gradient or nothing
     * are all fine.
     */
    accent?: ReactNode;
    /** The kicker over the headline. */
    eyebrow?: ReactNode;
    headline?: ReactNode;
    /** The sentence under the headline on `card`, and the whole of the copy on `line`. */
    lede?: ReactNode;
    /** The grid. One point renders full width; two or more go two-up from `sm`. */
    points?: readonly BulletinPoint[];
    /** The control on the footer rule — a `Button`, a link, a form. */
    action?: ReactNode;
    /** The line opposite the action. A licence, a date, a version. */
    footnote?: ReactNode;
    /** Under the rule, for whatever the panel has left to say. */
    children?: ReactNode;
    className?: string;
}
/**
 * The shell. Every slot is optional, and an omitted one renders nothing rather
 * than an empty box, so the same component covers a full credits panel and a
 * headline with one button under it.
 */
export declare function Bulletin({ variant, accent, eyebrow, headline, lede, points, action, footnote, children, className, }: BulletinProps): import("react").JSX.Element;
/** One band of the ribbon: the class that paints it, and the word shown on hover. */
export interface RibbonHue {
    name: string;
    fill: string;
}
/**
 * The categorical palette in ribbon order: warm through green through cool and
 * back to earth, so the run reads as one spectrum rather than eight swatches.
 *
 * Written out one full classname at a time, never assembled from the name.
 * Tailwind generates the classes it can see as literals, and a template string
 * would leave every one of them purged with nothing to report. A consumer
 * passing hues of their own is subject to the same rule in their own source.
 */
export declare const EDITORIAL_INKS: readonly RibbonHue[];
/**
 * A band of hues, for a `Bulletin`'s `accent`. Decorative, so it is hidden from
 * the reader that cannot see it and carries a `title` for the one that can:
 * hovering names the hue, and the segment widens to show the cut at full size.
 *
 * `h-1.5 w-full` on a panel and `h-1 min-w-20 flex-1 rounded-full` in a row —
 * stated by the caller, since the two shapes have nothing in common but the
 * colours.
 */
export declare function Ribbon({ hues, className, }: {
    hues?: readonly RibbonHue[];
    className?: string;
}): import("react").JSX.Element;

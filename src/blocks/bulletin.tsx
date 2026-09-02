import type { ReactNode } from "react";

import { cn } from "../cn.js";
import { INK_ON_CARD } from "../tone.js";
import {
  TypographyCaption,
  TypographyLabel,
  TypographyMuted,
} from "../typography/paragraph.js";
import { TypographyEyebrow, TypographyH3 } from "../typography/header.js";

// ---------------------------------------------------------------------------
// The panel a page uses to say one thing at length: an announcement, a release
// note, a status bulletin, a credits block.
//
// It exists because `Colophon` was the shape and the words at once. The words
// are fixed on purpose — an attribution every site rewrites is not an
// attribution — but locking them locked the layout with them, and the layout is
// the reusable half: an accent along the top edge, a kicker, a headline, a
// sentence, a two-up grid of short points, and a rule with a control on it.
// Nothing about that is about this package.
//
// So the shape is here with no copy in it at all, and `Colophon` is a preset of
// it, the way `TypographyProse` is a preset of `TypographyP`. A consumer
// wanting the look for their own announcement composes this one; a consumer
// wanting to credit the package renders `<Colophon />` and still cannot edit a
// word of it.
// ---------------------------------------------------------------------------

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
export function Bulletin({
  variant = "card",
  accent,
  eyebrow,
  headline,
  lede,
  points,
  action,
  footnote,
  children,
  className,
}: BulletinProps) {
  if (variant === "line") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-3",
          "pt-4",
          className,
        )}
      >
        {action}
        {accent}
        {lede && <TypographyCaption size="2xs">{lede}</TypographyCaption>}
      </div>
    );
  }

  const rule = action || footnote;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border",
        // It paints, so it hands down its ink.
        "bg-card",
        INK_ON_CARD,
        className,
      )}
    >
      {accent}

      <div className="p-6 sm:p-8">
        {eyebrow && (
          <TypographyEyebrow tone="subtle">{eyebrow}</TypographyEyebrow>
        )}
        {headline && (
          <TypographyH3 className={cn("max-w-lg", eyebrow && "mt-2")}>
            {headline}
          </TypographyH3>
        )}
        {lede && (
          <TypographyMuted as="p" className="mt-2 max-w-xl">
            {lede}
          </TypographyMuted>
        )}

        {points && points.length > 0 && (
          // A lone point takes the width. Two columns holding one of them is a
          // grid drawn around an empty cell.
          <ul
            className={cn(
              "mt-7 grid gap-6",
              points.length > 1 && "sm:grid-cols-2",
            )}
          >
            {points.map(({ title, body, mark, ink }, i) => (
              <li key={i}>
                <TypographyLabel
                  as="p"
                  size="xs"
                  className={cn("flex items-center gap-2", ink)}
                >
                  {mark && (
                    <span
                      aria-hidden
                      className={cn("size-2 rounded-full", mark)}
                    />
                  )}
                  {title}
                </TypographyLabel>
                <TypographyCaption as="p" size="xs" className="mt-1.5">
                  {body}
                </TypographyCaption>
              </li>
            ))}
          </ul>
        )}

        {rule && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            {action}
            {footnote && (
              <TypographyCaption size="2xs">{footnote}</TypographyCaption>
            )}
          </div>
        )}

        {children && (
          <TypographyCaption as="div" size="xs" className={cn(rule && "mt-5")}>
            {children}
          </TypographyCaption>
        )}
      </div>
    </section>
  );
}

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
export const EDITORIAL_INKS: readonly RibbonHue[] = [
  { name: "terracotta", fill: "bg-terracotta" },
  { name: "ochre", fill: "bg-ochre" },
  { name: "moss", fill: "bg-moss" },
  { name: "fern", fill: "bg-fern" },
  { name: "sage", fill: "bg-sage" },
  { name: "stone", fill: "bg-stone" },
  { name: "fig", fill: "bg-fig" },
  { name: "cocoa", fill: "bg-cocoa" },
];

/**
 * A band of hues, for a `Bulletin`'s `accent`. Decorative, so it is hidden from
 * the reader that cannot see it and carries a `title` for the one that can:
 * hovering names the hue, and the segment widens to show the cut at full size.
 *
 * `h-1.5 w-full` on a panel and `h-1 min-w-20 flex-1 rounded-full` in a row —
 * stated by the caller, since the two shapes have nothing in common but the
 * colours.
 */
export function Ribbon({
  hues = EDITORIAL_INKS,
  className,
}: {
  hues?: readonly RibbonHue[];
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex overflow-hidden", className)}>
      {hues.map(({ name, fill }) => (
        <span
          key={name}
          title={name}
          className={cn(
            "flex-1 transition-[flex-grow] duration-500 ease-out hover:grow-[2.5]",
            fill,
          )}
        />
      ))}
    </div>
  );
}

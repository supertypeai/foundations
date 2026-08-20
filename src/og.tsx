import type { ReactElement } from "react";

/** Open Graph card dimensions. The 1.91:1 ratio every major network crops to. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Character budgets, derived from the rendered card rather than guessed: at 62px
 * the title fits roughly 45 characters per line and the layout has room for
 * three, and the description gets two lines at 28px. Measured against the
 * longest real title in the corpus (101 chars), which renders on three lines.
 */
const TITLE_MAX = 135;
const DESCRIPTION_MAX = 160;

export interface OgCardOptions {
  title: string;
  description?: string;
  /** The site or brand name, set small at the foot of the card. */
  site?: string;
  /** Accent colour for the rule and the site name. Any CSS colour. */
  accent?: string;
  background?: string;
  foreground?: string;
  muted?: string;
}

/**
 * The social card layout, as a React element tree.
 *
 * Returns the tree rather than an image so the package does not import
 * `next/og`: the consumer passes this straight to `new ImageResponse(...)`,
 * which keeps the renderer — and the framework — on their side of the boundary.
 *
 * Everything is inline styles with explicit `display: flex`. This is rendered by
 * satori, not a browser: it supports no stylesheets, no class names, and no
 * default block layout, so a `<div>` with several children and no display set
 * silently stacks them on top of each other.
 *
 * Long text is truncated in JS rather than clamped in CSS. `-webkit-line-clamp`
 * needs `display: -webkit-box`, which contradicts the explicit flex above, and
 * relying on a renderer's support for a vendor-prefixed property to keep a
 * headline inside the card is a guarantee that fails silently — the card still
 * renders, just with the site name pushed off the bottom edge. Counting
 * characters always works and can be tested without a renderer.
 *
 * Scaling text to fit was the alternative and is worse: these are only ever seen
 * at thumbnail size, where shrinking to fit is what makes a headline unreadable.
 */

/** Truncates on a word boundary, so a cut title does not end mid-word. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
export function ogCard({
  title,
  description,
  site,
  accent = "#b1976b",
  background = "#0c0a09",
  foreground = "#fafaf9",
  muted = "#a8a29e",
}: OgCardOptions): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background,
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div
          style={{ display: "flex", width: "88px", height: "6px", background: accent }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: foreground,
          }}
        >
          {truncate(title, TITLE_MAX)}
        </div>
        {description ? (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              color: muted,
            }}
          >
            {truncate(description, DESCRIPTION_MAX)}
          </div>
        ) : null}
      </div>

      {site ? (
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: accent,
          }}
        >
          {site}
        </div>
      ) : null}
    </div>
  );
}

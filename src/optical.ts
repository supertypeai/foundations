/**
 * How far a centred mark misses the letters, per rung of a type ramp.
 *
 * `items-center` centres boxes, and the box is the line box: leading, ascent and
 * descent, only some of which the letters use. The mark beside a label therefore
 * centres on the font's box rather than on the band of ink a reader sees, and
 * whether those two agree is a property of the font, not of the design.
 *
 * The whole tool is one line of arithmetic, and the rounding is the reason it is
 * worth shipping. Ratios alone give one constant tilt for a face, 0.0235em for
 * Ubuntu Sans, which reads as every rung being equally out. Browsers quantise
 * ascent, descent and cap height to whole pixels before they lay a line out, and
 * rounded, that same face is half a pixel out at 11px, flat at 13px and half a
 * pixel out again at 22px. The rendered pages agree, so the rounding is what
 * separates a rung that needs the trim from one where it buys nothing.
 *
 * Build-time only, and only as good as the metrics handed to it. Verify cap
 * height against the browser rather than a table: `next/font` ships 693 for
 * Ubuntu Sans where canvas measures 727, and the wrong one flips the answer at
 * every rung.
 */

/** A font's vertical metrics, in font units. The four numbers every metrics
 *  table carries, `next/font`'s and capsize's alike. */
export interface FontMetrics {
  unitsPerEm: number;
  ascent: number;
  descent: number;
  capHeight: number;
}

/** One step of a ramp: the name an app knows it by, and its size in px. */
export interface TypeRung {
  name: string;
  fontSize: number;
}

export interface OpticalOffset extends TypeRung {
  /** How far below the cap band's centre a centred mark sits, in px. Positive is
   *  low, which is the direction rounding takes it. */
  offset: number;
  /** The same miss against the height of the letters it misses. Half a pixel is
   *  a twelfth of an 11px cap band and a thirty-second of a 36px one, so this is
   *  the number that says whether a reader sees it. */
  share: number;
  /** The rounded metrics the offset came out of, for a message worth reading. */
  used: { ascent: number; descent: number; capHeight: number };
}

const px = (value: number, fontSize: number, unitsPerEm: number) =>
  Math.round((value * fontSize) / unitsPerEm);

/**
 * The gap between the line box's centre and the cap band's, at one size.
 *
 * Half-leading cancels, so line height does not appear: a rung that is out stays
 * out however loosely it is set, and no retune of the ramp's leading fixes it.
 * Paint rounds the baseline a second time, in the same direction, so treat this
 * as the floor of the error rather than the whole of it.
 */
export function capBandOffset(metrics: FontMetrics, fontSize: number): number {
  const ascent = px(metrics.ascent, fontSize, metrics.unitsPerEm);
  const descent = px(metrics.descent, fontSize, metrics.unitsPerEm);
  const capHeight = px(metrics.capHeight, fontSize, metrics.unitsPerEm);
  return capHeight / 2 - (ascent - descent) / 2;
}

/**
 * Every rung whose centred mark misses the letters by enough to see, worst first.
 *
 * A rung that comes back is one where an icon, a badge or a swatch set beside the
 * text with `items-center` wants `CAP_TRIM` on the text to land on it. Most rungs
 * of a ramp are half a pixel out, so the pixel is not the question: `tolerance` is
 * a share of the cap band, and 0.05 is where a miss stops reading as a rounding
 * artefact and starts reading as two things that do not line up. Raise it for a
 * surface that only sets headlines, lower it to see the whole ramp.
 */
export function checkOptical(
  metrics: FontMetrics,
  rungs: readonly TypeRung[],
  { tolerance = 0.05 }: { tolerance?: number } = {},
): OpticalOffset[] {
  return rungs
    .map((rung) => {
      const used = {
        ascent: px(metrics.ascent, rung.fontSize, metrics.unitsPerEm),
        descent: px(metrics.descent, rung.fontSize, metrics.unitsPerEm),
        capHeight: px(metrics.capHeight, rung.fontSize, metrics.unitsPerEm),
      };
      const offset = used.capHeight / 2 - (used.ascent - used.descent) / 2;
      return { ...rung, offset, share: Math.abs(offset) / used.capHeight, used };
    })
    .filter((rung) => rung.share > tolerance)
    .sort((a, b) => b.share - a.share);
}

/** The failures as lines, on the model of `formatFailures` in contrast.ts. */
export function formatOffsets(offsets: readonly OpticalOffset[]): string {
  return offsets
    .map(
      ({ name, fontSize, offset, used }) =>
        `  ${name} (${fontSize}px)  mark sits ${Math.abs(offset)}px ${offset > 0 ? "below" : "above"} the cap band` +
        `, ${Math.round((Math.abs(offset) / used.capHeight) * 100)}% of it` +
        `  [ascent ${used.ascent}, descent ${used.descent}, cap ${used.capHeight}]`,
    )
    .join("\n");
}

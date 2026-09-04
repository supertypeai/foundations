import { describe, expect, it } from "vitest";

import { checkOptical } from "../dist/optical.js";

/**
 * Ubuntu Sans, the face both apps bind. Ascent and descent are the table
 * `next/font` ships; cap height is not, because that table says 693 and the
 * browser measures 727 through `actualBoundingBoxAscent` on an H at 11px, 13px
 * and 22px alike. Rounded, 693 puts the h1 rung flat where it renders a pixel
 * out, so the check is only ever as good as the four numbers fed to it.
 */
const UBUNTU_SANS = {
  unitsPerEm: 1000,
  ascent: 940,
  descent: 260,
  capHeight: 727,
};

/**
 * Measured, not derived: each rung rendered headless at 1x beside a centred
 * icon, with the ink band of the letters and of the mark read off the bitmap.
 * Paint rounds the baseline once more in the same direction, which is why the
 * render doubles what the arithmetic predicts. The sign and the zero are the
 * part a check can hold.
 */
const RENDERED: [name: string, fontSize: number, predicted: number, measured: number][] = [
  ["2xs, the micro label", 11, 0.5, 1],
  ["sm, the workhorse", 13, 0, 0],
  ["h1, the page title", 22, 0.5, 1],
];

describe("optical offset", () => {
  /** One rung's miss, through the only door the module has. */
  const offsetAt = (metrics: typeof UBUNTU_SANS, fontSize: number) =>
    checkOptical(metrics, [{ name: "x", fontSize }], { tolerance: 0 })[0]?.offset ?? 0;

  it.each(RENDERED)("%s", (_name, fontSize, predicted, measured) => {
    expect(offsetAt(UBUNTU_SANS, fontSize)).toBe(predicted);
    expect(Math.sign(offsetAt(UBUNTU_SANS, fontSize))).toBe(Math.sign(measured));
  });

  /**
   * The table's cap height, the one number in it that disagrees with the browser:
   * it reports the page title as flat, which the render contradicts. Leading needs
   * no test of its own, since it is not a parameter: half-leading cancels out of
   * the arithmetic, so there is no way to pass one in and no way for it to matter.
   */
  it("turns on the metrics", () => {
    expect(offsetAt({ ...UBUNTU_SANS, capHeight: 693 }, 22)).toBe(0);
    expect(offsetAt(UBUNTU_SANS, 22)).toBe(0.5);
  });

  /**
   * The same half pixel at three sizes, ranked by what it is half a pixel OF.
   * Ranking on the offset alone would call these three a tie and send a trim to
   * the page title, where a reader cannot see the miss it fixes.
   */
  it("ranks a rung by the share of the letters the mark misses", () => {
    const out = checkOptical(UBUNTU_SANS, [
      { name: "micro", fontSize: 11 },
      { name: "title", fontSize: 22 },
      { name: "hero", fontSize: 36 },
    ], { tolerance: 0 });
    expect(out.map((r) => r.name)).toEqual(["micro", "title", "hero"]);
    expect(out.map((r) => r.offset)).toEqual([0.5, 0.5, 0.5]);
    expect(out.map((r) => Math.round(r.share * 100))).toEqual([6, 3, 2]);
  });

  /**
   * What the default tolerance is for. Most of a ramp is half a pixel out, so a
   * check that reported all of it would be read once and then ignored. The bar
   * keeps it to the rungs where the miss is a twentieth of the letters or more,
   * which on this face is the micro end and nothing above 12px.
   */
  it("reports the micro rungs and stays quiet about the rest", () => {
    const ramp = [10, 11, 12, 13, 14, 16, 18, 22, 24, 36].map((fontSize) => ({
      name: `${fontSize}`,
      fontSize,
    }));
    expect(checkOptical(UBUNTU_SANS, ramp).map((r) => r.fontSize)).toEqual([10, 11, 12]);
  });

  /**
   * A face whose cap height and its ascent round to the same distance either
   * side of the box centre needs nothing anywhere, which is the answer this
   * has to be able to give.
   */
  it("clears a ramp that lands flat", () => {
    const flat = { unitsPerEm: 1000, ascent: 750, descent: 250, capHeight: 500 };
    expect(checkOptical(flat, [{ name: "any", fontSize: 16 }])).toEqual([]);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  cn,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyStat,
  headingClass,
} from "../dist/index.js";

/**
 * A primitive has to survive its own `cn`. tailwind-merge used to classify
 * `text-h1`…`text-h4` as colours and drop whatever colour stood beside them, which
 * was invisible: a heading with no ink inherits from the body. These assert the
 * rendered markup rather than the merge, since the merge is what was wrong.
 */

/** The class attribute a primitive actually ships. */
const classes = (markup: string) => markup.match(/class="([^"]*)"/)?.[1] ?? "";

/** The ink class every heading composes, from `HEADING_BASE`. */
const INK = "text-[color:var(--ink,var(--foreground))]";

describe("a heading keeps its ink alongside its rung", () => {
  const headings = [
    ["TypographyH1", <TypographyH1>t</TypographyH1>, "text-h1"],
    ["TypographyH2", <TypographyH2>t</TypographyH2>, "text-h2"],
    ["TypographyH3", <TypographyH3>t</TypographyH3>, "text-h3"],
    ["TypographyH4", <TypographyH4>t</TypographyH4>, "text-h4"],
  ] as const;

  for (const [name, element, rung] of headings) {
    it(`${name} ships both ${rung} and the ink`, () => {
      const rendered = classes(renderToStaticMarkup(element));
      expect(rendered, `${name} lost its rung`).toContain(rung);
      expect(
        rendered,
        `${name} lost its ink: it will inherit whatever painted above it, so ` +
          "INK_ON_CARD and friends do nothing for it",
      ).toContain(INK);
    });
  }

  it("holds for the display variants, which were never affected", () => {
    // `text-4xl` is a real t-shirt size, so tailwind-merge always grouped it
    // correctly. Here so a future change to HEADING_BASE cannot break the half
    // that was fine while the tests only cover the half that was not.
    const rendered = classes(
      renderToStaticMarkup(<TypographyH1 variant="display">t</TypographyH1>),
    );
    expect(rendered).toContain("text-4xl");
    expect(rendered).toContain(INK);
  });

  it("holds for headingClass, the escape hatch that renders no element", () => {
    expect(headingClass()).toContain("text-h2");
    expect(headingClass()).toContain(INK);
  });
});

describe("a stat keeps its rung alongside its ink", () => {
  // The same collision, resolving the other way: `statVariants` declares `size`
  // before `tone`, so it was the RUNG that lost. A muted stat on a heading rung
  // rendered at whatever size it inherited.
  const surfaces = [
    ["card", "text-h4"],
    ["panel", "text-h3"],
    ["section", "text-h2"],
    ["page", "text-h1"],
  ] as const;

  for (const [size, rung] of surfaces) {
    it(`size="${size}" tone="muted" keeps ${rung}`, () => {
      const rendered = classes(
        renderToStaticMarkup(
          <TypographyStat size={size} tone="muted">
            1,284
          </TypographyStat>,
        ),
      );
      expect(rendered, `the ${size} rung was dropped`).toContain(rung);
      expect(rendered).toContain("--ink-muted");
    });
  }
});

describe("registering the rungs costs no real conflict", () => {
  // Every one of these SHOULD collapse. The fix widens what `cn` keeps, so the
  // risk it carries is keeping too much.
  it("still resolves two heading rungs to the last one", () => {
    expect(cn("text-h2", "text-h3")).toBe("text-h3");
  });

  it("still resolves a heading rung against the body ramp", () => {
    expect(cn("text-h3", "text-sm")).toBe("text-sm");
    expect(cn("text-sm", "text-h3")).toBe("text-h3");
  });

  it("still resolves two inks to the last one", () => {
    expect(cn("text-muted-foreground", INK)).toBe(INK);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  CAP_TRIM,
  TypographyCaption,
  TypographyEyebrow,
  TypographyH2,
  TypographyLabel,
  TypographyMuted,
  TypographyProse,
  TypographySmall,
  TypographyStat,
} from "../dist/index.js";
import { Button } from "../dist/blocks/index.js";

/**
 * Who owns leading, as one table. A rung carries its own, and a primitive states
 * one only where it shares a rung with a role needing a different number. Both
 * halves had drifted: the caption stated one it should not, the stat stated none.
 */
const OWNS_ITS_LEADING: [string, () => React.ReactElement, boolean][] = [
  ["heading", () => <TypographyH2>h</TypographyH2>, false],
  ["interface copy", () => <TypographyMuted>p</TypographyMuted>, false],
  ["caption", () => <TypographyCaption>c</TypographyCaption>, false],
  ["small print", () => <TypographySmall>s</TypographySmall>, false],
  ["label", () => <TypographyLabel>l</TypographyLabel>, false],
  ["reading copy", () => <TypographyProse>r</TypographyProse>, true],
  ["a value", () => <TypographyStat>1</TypographyStat>, true],
];

describe("leading ownership", () => {
  it.each(OWNS_ITS_LEADING)("%s", (_role, render, states) => {
    const stated = / leading-|"leading-/.test(renderToStaticMarkup(render()));
    expect(stated).toBe(states);
  });

  // The pair the caption's own docstring calls one pair. They share a size axis
  // for it, and a leading stated on one of them is what breaks it.
  it("sets a caption and the label beside it on one rhythm", () => {
    for (const size of ["sm", "xs", "2xs"] as const) {
      const lead = (html: string) =>
        html.match(/leading-[a-z0-9]+|text-[a-z0-9]+/g)?.filter((c) =>
          c.startsWith("leading-"),
        ) ?? [];
      expect(
        lead(renderToStaticMarkup(<TypographyCaption size={size}>c</TypographyCaption>)),
      ).toEqual(
        lead(renderToStaticMarkup(<TypographyLabel size={size}>l</TypographyLabel>)),
      );
    }
  });

  /**
   * The cap trim is the row's business, not a primitive's. Shipping it on one
   * would shorten every call site's box to its ink, which is right only where a
   * mark sits beside the text and the two have to centre on each other.
   */
  it("keeps the cap trim opt-in", () => {
    for (const [, render] of OWNS_ITS_LEADING) {
      expect(renderToStaticMarkup(render())).not.toContain("text-box");
    }
    expect(
      renderToStaticMarkup(
        <TypographyEyebrow className={CAP_TRIM}>Best reach</TypographyEyebrow>,
      ),
    ).toContain(CAP_TRIM);
  });

  /**
   * What a control does to its own label, in one place. The padding keeps a
   * clipping label's descenders inside the clip box and the pull keeps the trimmed
   * box the thing the row centres on. On a browser with no `text-box` they cancel.
   */
  it("trims a control's label without letting the room reach the layout box", () => {
    const room = /pb-\[([\d.]+em)\]/.exec(CAP_TRIM)?.[1];
    expect(room).toBeTruthy();
    expect(CAP_TRIM).toContain(`-mb-[${room}]`);

    // The wrapper is anatomy, so it carries a slot like every other part Button marks.
    const markup = renderToStaticMarkup(<Button size="sm">Revoke</Button>);
    expect(markup).toContain('data-slot="label"');
    expect(markup).toContain("text-box");
  });
});

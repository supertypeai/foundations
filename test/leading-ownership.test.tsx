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
 * Who owns leading, as one table.
 *
 * A rung carries its own, and an app retunes the ramp to move it. A primitive
 * states one of its own only where it shares a rung with a role that needs a
 * different number: the reading paragraph, which sits on the section-heading
 * rung, and a value, which sits on the body rungs and never wraps.
 *
 * Both halves had drifted. The caption stated one, which held it apart from the
 * label it forms a pair with and overrode the retune an editorial subtree had
 * just made. The stat stated none, so every call site spelled one by hand.
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
   * What a control does to its own label, in one place.
   *
   * The padding is what keeps a clipping label's descenders inside the clip box; the pull
   * is what keeps the trimmed box the thing the row centres on. Drop the pull and every
   * trimmed label grows by the descender room. Drop the padding and `truncate` shears the
   * tails off again. On a browser with no `text-box` the two cancel, which is the whole of
   * the fallback, so this also pins that nothing shifts there.
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

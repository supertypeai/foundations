import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// The module, not the barrel, for the reason tabs-attributes.test.tsx gives.
import { Callout } from "../dist/blocks/callout.js";
import { TypographyP } from "../dist/typography/paragraph.js";

/**
 * A block that takes `children` takes flow content, so wrapping the slot in a `<p>`
 * is the one shape whose failure is invisible here and loud in the app: the parser
 * closes the paragraph, and React reports a hydration error against a callout that
 * renders correctly. `Callout` shipped that way in both densities.
 */
/** What a `<p>` or a `<span>` in the output is holding. Both take phrasing content
 *  only: the paragraph is the case the parser rewrites and React reports, the span
 *  the case that merely fails to validate. */
const phrasingWrappers = (html: string) =>
  [...html.matchAll(/<(p|span)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((match) => match[2]);

const paragraphsIn = (html: string) =>
  [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);

const DENSITIES = ["compact", "editorial"] as const;

describe("a slot holds what the caller puts in it", () => {
  it.each(DENSITIES)("a %s Callout takes a list", (density) => {
    const html = renderToStaticMarkup(
      <Callout density={density} title="Moving 4 contacts">
        <ul>
          <li>Owner reassigned</li>
        </ul>
      </Callout>,
    );
    expect(html).toContain("<ul>");
    expect(
      phrasingWrappers(html).filter((body) => /<(ul|ol|div|p)\b/.test(body)),
      "a phrasing element in the output holds a block: the parser closes a <p> early, and a <span> around one never validates",
    ).toEqual([]);
  });

  it.each(DENSITIES)("a %s Callout takes more than one paragraph", (density) => {
    const html = renderToStaticMarkup(
      <Callout density={density}>
        <TypographyP>The channel is gone.</TypographyP>
        <TypographyP>Reassign the tasks below.</TypographyP>
      </Callout>,
    );
    expect(paragraphsIn(html)).toHaveLength(2);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// The module, not the barrel, for the reason tabs-attributes.test.tsx gives.
import { Button } from "../dist/blocks/button.js";
import { Badge } from "../dist/blocks/badge.js";

const text = (html: string) => html.replace(/<[^>]+>/g, "");

/**
 * `render` follows Base UI: the component's own children win, and an element that
 * arrived with a label keeps it. Button once cloned `children: undefined` over the
 * element, so `<Button render={<Link>Add to Slack</Link>} />` shipped as an empty
 * anchor with no error anywhere.
 */
describe("a render element keeps its label unless the component gives one", () => {
  it.each([
    ["Button", Button],
    ["Badge", Badge],
  ] as const)("%s", (_, Component) => {
    const own = renderToStaticMarkup(
      <Component render={<a href="/x">Own</a>} />,
    );
    expect(own).toMatch(/^<a href="\/x"/);
    expect(text(own)).toBe("Own");

    const given = renderToStaticMarkup(
      <Component render={<a href="/x">Own</a>}>Given</Component>,
    );
    expect(text(given)).toBe("Given");
  });

  it("trims the label the same way wherever it came from", () => {
    const own = renderToStaticMarkup(<Button render={<a href="/x">Own</a>} />);
    const given = renderToStaticMarkup(<Button render={<a href="/x" />}>Own</Button>);
    expect(own).toBe(given);
  });
});

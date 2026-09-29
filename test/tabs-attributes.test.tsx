import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// The module, not the barrel: `blocks/index.js` reaches Card, which reaches
// next-view-transitions and a bare `next/link` that plain Node cannot resolve. The
// NOTE in src/index.ts is about exactly this.
import { TabGroup } from "../dist/blocks/tabs.js";

/**
 * A Tailwind variant naming an attribute nothing sets is silent: the class
 * compiles, the selector never matches, and the symptom looks like a bug
 * elsewhere. So every `data-*` a variant selects on has to be an attribute the
 * rendered markup carries.
 */
const render = (ui: React.ReactNode) => renderToStaticMarkup(ui);

/** The plain strip: the boxed variant, no icons. */
const plain = () =>
  render(
    <TabGroup
      tabs={[
        { value: "one", label: "One", content: "Panel" },
        { value: "two", label: "Two", content: "Panel" },
      ]}
    />,
  );

/** The `line` variant and an icon, so the marker and `data-icon` selectors are in scope. */
const grouped = () =>
  render(
    <TabGroup
      variant="line"
      tabs={[
        { value: "one", label: "One", icon: <svg />, content: "Panel" },
        { value: "two", label: "Two", content: "Panel" },
      ]}
    />,
  );

/**
 * Every `data-x` / `data-[x=y]` a Tailwind variant in the markup selects on.
 *
 * `has-data-[...]` reaches into a descendant that may legitimately be absent — a trigger
 * with no icon writes no `data-icon` — so a strip that has one is what proves those.
 */
function selectedAttributes(html: string, optional: boolean): Set<string> {
  const own = optional ? html.replace(/has-data-\[[^\]]+\]/g, "") : html;
  const names = new Set<string>();
  for (const [, name] of own.matchAll(/data-\[([a-z-]+)=/g)) names.add(name);
  // The bare form, `data-active:` or `group-data-vertical/tabs:`, ended by its colon.
  for (const [, name] of own.matchAll(/data-([a-z-]+):/g)) names.add(name);
  return names;
}

/** Every `data-*` attribute present anywhere in the rendered markup. */
const emittedAttributes = (html: string) =>
  new Set([...html.matchAll(/\sdata-([a-z-]+)=/g)].map(([, name]) => name));

const orphans = (html: string, { optional = true } = {}) =>
  [...selectedAttributes(html, optional)].filter(
    (n) => !emittedAttributes(html).has(n),
  );

describe("tabs attribute styling", () => {
  it("only selects on data attributes the primitive emits", () => {
    expect(orphans(plain())).toEqual([]);
  });

  it("still only selects on emitted attributes once a variant and an icon are in play", () => {
    // The icon supplies `data-icon`, which the plain strip above cannot show. Nothing is treated as optional here, so
    // this is also what asserts `has-data-[icon=...]` has something to match.
    expect(orphans(grouped(), { optional: false })).toEqual([]);
  });

  it("stacks the panel below the tab strip", () => {
    const [root] = plain().match(/<div[^>]*data-slot="tabs"[^>]*>/) ?? [];
    expect(root).toContain('data-orientation="horizontal"');
    expect(root).toContain("data-[orientation=horizontal]:flex-col");
  });

  /** Tabs with no panels are a picker: the strip alone, in whatever toolbar holds it. */
  it("renders a picker as the strip alone, at the size asked for", () => {
    const html = render(
      <TabGroup size="sm" value="clicks" tabs={[{ value: "clicks", label: "Clicks" }, { value: "ctr", label: "CTR" }]} />,
    );
    expect(html).not.toContain('data-slot="tabs-content"');
    expect(html).toContain('data-size="sm"');
    expect(html).toContain("h-7");
    expect(orphans(html, { optional: false }).filter((n) => n !== "icon")).toEqual([]);
  });
});

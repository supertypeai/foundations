import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  TabGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  // The module, not the barrel: `blocks/index.js` reaches Card, which reaches
  // next-view-transitions and a bare `next/link` that plain Node cannot resolve. The
  // NOTE in src/index.ts is about exactly this.
} from "../dist/blocks/tabs.js";

/**
 * A Tailwind variant naming an attribute nothing sets is silent: the class
 * compiles, the selector never matches, and the symptom looks like a bug
 * elsewhere. So every `data-*` a variant selects on has to be an attribute the
 * rendered markup carries.
 */
const render = (ui: React.ReactNode) => renderToStaticMarkup(ui);

const composed = () =>
  render(
    <Tabs value="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel</TabsContent>
    </Tabs>,
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
    expect(orphans(composed())).toEqual([]);
  });

  it("still only selects on emitted attributes once a variant and an icon are in play", () => {
    // `TabGroup` is the case that supplies `data-icon` and `data-variant`, neither of
    // which the composed strip above can see. Nothing is treated as optional here, so
    // this is also what asserts `has-data-[icon=...]` has something to match.
    expect(orphans(grouped(), { optional: false })).toEqual([]);
  });

  it("stacks the panel below the tab strip", () => {
    const [root] = composed().match(/<div[^>]*data-slot="tabs"[^>]*>/) ?? [];
    expect(root).toContain('data-orientation="horizontal"');
    expect(root).toContain("data-[orientation=horizontal]:flex-col");
  });
});

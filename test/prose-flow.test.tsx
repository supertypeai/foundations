import { readFileSync } from "node:fs";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProseFlow } from "../dist/index.js";
import { proseMdxComponents } from "../dist/mdx.js";
import { createEssay } from "../dist/essay/index.js";

const map = proseMdxComponents as unknown as Record<string, ComponentType<any>>;
const render = (tag: string, props: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(map[tag], props, "text"));

/** The classes on the outermost element only: a variant aimed at a child is not its margin. */
const rootClasses = (html: string) =>
  (/^<[a-z0-9]+[^>]*?class="([^"]*)"/.exec(html)?.[1] ?? "").split(" ");

/**
 * Space between blocks is the container's. The headings had no margin while the
 * fences, quotes and tables each set their own, so a post ran its paragraphs and
 * headings flush and spaced everything else.
 */
describe("prose flow", () => {
  const ELEMENTS = ["h2", "h3", "h4", "p", "ul", "ol", "blockquote", "pre", "hr", "table"];

  it.each(ELEMENTS)("%s carries no outer margin", (tag) => {
    const margins = rootClasses(render(tag)).filter((c) => /^-?m[trblxy]?-/.test(c));
    expect(margins).toEqual([]);
  });

  it("spaces blocks from one zero-specificity rule set", () => {
    expect(renderToStaticMarkup(<ProseFlow>x</ProseFlow>)).toContain('class="prose-flow"');

    const css = readFileSync(new URL("../src/prose.css", import.meta.url), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = [...css.matchAll(/^\s*([^{}\n]*\.prose-flow[^{]*)\{/gm)].map((m) => m[1].trim());
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) expect(selector).toMatch(/^:where\(.*\)$/);
  });

  // The essay shell ran its own 20px/64px gaps beside a post's 24px/54px, on the
  // same reading surface.
  it("gives an essay the same rhythm as a post", () => {
    const { EssayLayout, EssaySection } = createEssay();
    const html = renderToStaticMarkup(
      <EssayLayout index={[]}>
        <EssaySection id="a" heading="A">
          <p>body</p>
        </EssaySection>
      </EssayLayout>,
    );
    expect(html).toContain("gap-(--flow-section)");
    expect(html).toMatch(/class="prose-flow"><h2/);
  });

  // `rehype-autolink-headings` wrapped each heading in an `a`, and the map's `a`
  // painted the whole heading as a dotted body link.
  it("links a heading to itself in the heading's own ink", () => {
    const html = render("h2", { id: "setup" });
    expect(html).toMatch(/^<h2[^>]*id="setup"[^>]*><a href="#setup" class="[^"]*">text<\/a><\/h2>$/);
    expect(html).not.toContain("tone");
    expect(render("h2")).not.toContain("<a");
  });

  // The map passed on only href and children, so each backref pointed at an id
  // that was never rendered.
  it("keeps the ids and labels a footnote links by", () => {
    const ref = render("a", {
      href: "#user-content-fn-1",
      id: "user-content-fnref-1",
      "data-footnote-ref": true,
      "aria-describedby": "footnote-label",
    });
    expect(ref).toContain('id="user-content-fnref-1"');
    expect(ref).toContain("data-footnote-ref");
    expect(ref).toContain('aria-describedby="footnote-label"');

    const backref = render("a", {
      href: "#user-content-fnref-1",
      "aria-label": "Back to reference 1",
      className: "data-footnote-backref",
    });
    expect(backref).toContain('aria-label="Back to reference 1"');
    expect(backref).toMatch(/class="[^"]*data-footnote-backref/);
  });
});

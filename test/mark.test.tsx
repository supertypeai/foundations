import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Mark,
  Marked,
  TypographyCaption,
  TypographyEyebrow,
  TypographyH3,
  TypographyLabel,
  TypographyP,
} from "../dist/index.js";
import * as root from "../dist/index.js";
import { Badge, Button, CardTitle } from "../dist/blocks/index.js";
import { designRules } from "../dist/eslint.js";

const decode = (html: string) => html.replaceAll("&amp;", "&").replaceAll("&gt;", ">");
const classes = (html: string) => / class="([^"]*)"/.exec(decode(html))?.[1].split(" ") ?? [];

/** The slot's own markup, and what follows it up to the end of the words. */
const slotted = (html: string) =>
  /<span data-slot="mark" class="([^"]*)"><svg><\/svg><\/span><(span|div)[^>]*>([^<]*)<\/\2>/.exec(decode(html));

/**
 * One way to put a glyph beside words, so one contract to pin: the slot renders
 * inside the words' element, sizes a bare glyph to one em, and the row it makes
 * cannot be turned back into one centred on a line box.
 */
describe("a mark", () => {
  it.each([
    ["eyebrow, whose rung sets display block", <TypographyEyebrow mark={<svg />} className="items-center">Reads</TypographyEyebrow>],
    ["label a caller made a flex row", <TypographyLabel mark={<svg />} className="flex items-start">Reads</TypographyLabel>],
    ["caption", <TypographyCaption mark={<svg />}>Reads</TypographyCaption>],
    ["paragraph", <TypographyP mark={<svg />}>Reads</TypographyP>],
    ["heading", <TypographyH3 mark={<svg />}>Reads</TypographyH3>],
    ["card title", <CardTitle mark={<svg />}>Reads</CardTitle>],
  ])("seats inside a %s", (_, element) => {
    const html = renderToStaticMarkup(element);
    const outer = classes(html);
    expect(outer).toContain("items-baseline");
    for (const cls of ["block", "items-center", "items-start"]) expect(outer).not.toContain(cls);
    // A grid unless the caller named a display of its own.
    expect(outer).toContain(outer.includes("flex") ? "flex" : "grid");

    const [, slot, , words] = slotted(html) ?? [];
    expect(slot).toContain("h-[1cap]");
    expect(slot).toContain("before:self-baseline");
    expect(slot).toContain("[&>svg]:size-[1em]");
    expect(words).toBe("Reads");
  });

  it("goes after the words as markEnd, keeps a caller's gap and display, and leaves an unmarked role alone", () => {
    const end = renderToStaticMarkup(<TypographyLabel markEnd={<svg />}>Picked</TypographyLabel>);
    expect(classes(end)).toContain("grid-cols-[minmax(0,max-content)_auto]");
    expect(end).toMatch(/>Picked<\/span><span data-slot="mark"[^>]*><svg><\/svg><\/span><\/span>$/);

    const gapped = classes(renderToStaticMarkup(<TypographyLabel mark={<svg />} className="gap-x-3">x</TypographyLabel>));
    expect(gapped).toContain("gap-x-3");
    expect(gapped).not.toContain("gap-x-2");

    // A display the caller names stands, so a row can hide at a breakpoint or sit inline.
    for (const given of ["inline-flex", "hidden sm:flex"]) {
      const out = classes(renderToStaticMarkup(<TypographyCaption mark={<svg />} className={given}>x</TypographyCaption>));
      expect(out).toEqual(expect.arrayContaining(given.split(" ")));
      expect(out).not.toContain("grid");
    }

    for (const mark of [undefined, null, false]) {
      expect(renderToStaticMarkup(<TypographyLabel mark={mark} markEnd={mark}>x</TypographyLabel>)).toBe(
        renderToStaticMarkup(<TypographyLabel>x</TypographyLabel>),
      );
    }
  });

  it("stands on its own inside a sentence, and gives lines under a marked one its column", () => {
    const inline = classes(renderToStaticMarkup(<Mark><svg /></Mark>));
    expect(inline).toEqual(expect.arrayContaining(["inline-flex", "align-baseline"]));

    const block = renderToStaticMarkup(
      <Marked mark={<svg />} title={<TypographyLabel>Discount applied</TypographyLabel>}>
        <TypographyCaption>Saved 20%</TypographyCaption>
      </Marked>,
    );
    // The title takes the mark and spans both columns; the lines under it start where its words do.
    expect(slotted(block)?.[3]).toBe("Discount applied");
    expect(decode(block)).toContain("col-span-full grid-cols-subgrid");
    expect(decode(block)).toMatch(/class="col-start-2[^"]*"><span[^>]*>Saved 20%/);

    const plain = renderToStaticMarkup(
      <Marked mark={false} title={<TypographyLabel>Discount applied</TypographyLabel>}>
        <TypographyCaption>Saved 20%</TypographyCaption>
      </Marked>,
    );
    expect(plain).not.toContain("data-slot");
    expect(plain).not.toContain("col-start-2");
  });

  it("truncates the words and never the mark", () => {
    const marked = renderToStaticMarkup(<TypographyLabel mark={<svg />} truncate>Long</TypographyLabel>);
    expect(classes(marked)).not.toContain("truncate");
    expect(marked).toMatch(/<span class="min-w-0 truncate">Long<\/span>/);
    expect(classes(renderToStaticMarkup(<TypographyLabel truncate>Long</TypographyLabel>))).toContain("truncate");
  });

  /**
   * Words that may hold blocks get a block to hold them: a callout's body is a
   * list as often as a sentence, and a list cannot sit in a span.
   */
  it("keeps block words in a block", () => {
    const html = renderToStaticMarkup(
      <TypographyP as="div" mark={<svg />}>
        <ul><li>One</li></ul>
      </TypographyP>,
    );
    expect(html).toMatch(/<\/span><div class="min-w-0"><ul>/);
    expect(renderToStaticMarkup(<TypographyP mark={<svg />}>One</TypographyP>)).toMatch(/<span class="min-w-0">One/);
  });

  /** A badge's 10px label once carried a 12px glyph, forced, against a 1px border. */
  it("is one em in a control too, the same rule as the slot's", () => {
    for (const html of [
      renderToStaticMarkup(<Badge size="xs"><svg />CC a reply</Badge>),
      renderToStaticMarkup(<Button size="sm"><svg />Revoke</Button>),
    ]) {
      expect(classes(html)).toContain("[&>svg]:size-[1em]");
      expect(classes(html).some((c) => /svg\]:size-\d/.test(c))).toBe(false);
      expect(html).toContain('data-slot="label"');
    }
  });
});

/** `{count} to act on` split into two labels once, and the badge put its gap between them. */
it("keeps adjacent words in a control as one label", () => {
  const html = renderToStaticMarkup(<Badge>{1} to act on</Badge>);
  expect(html.match(/data-slot="label"/g)).toHaveLength(1);
  expect(html).toContain(">1 to act on<");
});

/**
 * The lint names the text roles by a list, and the list has to be the components
 * that take a mark: one missing lets a loose glyph through, one extra points a
 * caller at a prop that is not there.
 */
it("names in lint exactly the roles that take a mark", () => {
  const rule = designRules().find((r) => r.message.includes("is their mark"))!;
  const listed = new RegExp(/name\.name=\/(.+?)\/\]/.exec(rule.selector)![1]!);
  const candidates = { ...root, CardTitle } as Record<string, unknown>;
  const roles: string[] = [];
  for (const [name, C] of Object.entries(candidates)) {
    if (!/^[A-Z]/.test(name) || typeof C !== "function") continue;
    let marked = false;
    try {
      const Role = C as (props: object) => React.ReactNode;
      marked = renderToStaticMarkup(<Role mark={<svg />}>x</Role>).includes('data-slot="mark"');
    } catch {
      // A component that needs more than words to render is no text role.
    }
    if (marked && name !== "Mark") roles.push(name);
    expect(listed.test(name), name).toBe(marked && name !== "Mark");
  }
  expect(roles).toEqual(expect.arrayContaining(["TypographyCaption", "TypographyH1", "TypographyEyebrow", "CardTitle"]));
});

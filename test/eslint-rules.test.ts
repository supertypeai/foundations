import { describe, expect, it } from "vitest";
import { designRules } from "../dist/eslint.js";

/**
 * The rules as a consumer receives them, which is one call.
 *
 * This file used to drive the six builders directly, and exporting them for that
 * is what widened the entry point to fourteen names for an app that imports one.
 * Every assertion below reaches its rule by what the rule says, so the set can be
 * refactored underneath without the test noticing.
 */
const messageWith = (needle: string, options?: Parameters<typeof designRules>[0]) =>
  designRules(options).filter((rule) => rule.message.includes(needle));

/** The regex inside a `Literal[value=/…/]` selector, as esquery would read it. */
const patterns = (rules: { selector: string }[]) =>
  rules
    .map((r) => /\[value=\/(.*)\/[a-z]*\]$/.exec(r.selector)?.[1])
    .filter((p): p is string => Boolean(p));

describe("rule shape", () => {
  const all = designRules({ weights: true });

  it("gives every rule a selector and a message", () => {
    for (const rule of all) {
      expect(rule.selector, JSON.stringify(rule)).toBeTruthy();
      expect(rule.message, rule.selector).toBeTruthy();
    }
  });

  it("never writes a literal / inside a pattern, which esquery truncates at", () => {
    // ESLint 8's bundled esquery ends a pattern at the first slash it sees,
    // however it is escaped, and hands RegExp the truncated half. Escapes have
    // to be written \x2f.
    for (const pattern of patterns(all)) {
      expect(pattern.includes("/"), pattern).toBe(false);
    }
  });

  it("compiles every embedded pattern", () => {
    const found = patterns(all);
    expect(found.length).toBeGreaterThan(0);
    for (const pattern of found) expect(() => new RegExp(pattern)).not.toThrow();
  });

  it("returns the same set every call, since nothing varies per app", () => {
    expect(designRules()).toEqual(designRules());
  });
});

describe("what a consumer configures", () => {
  it("names the caller's accents, and has a default so the argument is optional", () => {
    expect(messageWith("the brand tints", { accents: "the brand tints" }).length).toBeGreaterThan(0);
    expect(messageWith("a brand accent").length).toBeGreaterThan(0);
  });

  it("quotes the ramp back, and leaves the weight rule out by default", () => {
    expect(messageWith("text-xs 12", { ramp: "text-xs 12 / text-sm 13" }).length).toBeGreaterThan(0);
    expect(JSON.stringify(designRules({ weights: true })).length).toBeGreaterThan(
      JSON.stringify(designRules()).length,
    );
  });

  /**
   * The one flag, and the reason it is a flag: a surface that sets its own ramp
   * still has to spell its colours in tokens. Picking the colour half by hand is
   * what this replaced, and how an app once ran four of the six sets.
   */
  it("drops the type rules and keeps the colour ones", () => {
    const without = designRules({ typography: false });
    expect(without.length).toBeLessThan(designRules().length);
    expect(without.filter((r) => r.message.includes("a brand accent")).length).toBeGreaterThan(0);
  });
});

describe("the rules themselves", () => {
  it("restricts the solid dark: form and leaves an alpha scrim alone", () => {
    // `dark:bg-destructive/20` against a `/10` is the same token at a different
    // density, so the patterns must not match a value carrying an alpha suffix.
    const dark = designRules().filter((r) => r.selector.includes("dark:"));
    expect(dark.length).toBeGreaterThan(0);
    for (const pattern of patterns(dark)) {
      expect(new RegExp(pattern).test(" dark:bg-destructive/20"), pattern).toBe(false);
    }
  });

  it("matches a bare anchor in a render prop, on the components that take href", () => {
    const [{ selector, message }] = designRules().filter((r) =>
      r.selector.includes('JSXAttribute[name.name="render"]'),
    );
    expect(selector).toContain("JSXExpressionContainer");
    // The rendered element: only a bare <a>. `render={<Link/>}` still routes.
    expect(selector.endsWith('JSXOpeningElement[name.name="a"]')).toBe(true);
    const components = /name\.name=\/(.*?)\/\]/.exec(selector)?.[1];
    expect(components, selector).toBeTruthy();
    const match = new RegExp(components!);
    for (const name of ["Button", "Badge", "Card"]) expect(match.test(name), name).toBe(true);
    // RailLink takes a router element through `render` on purpose: its module
    // stays importable without Next, so it has no href to offer instead.
    for (const name of ["RailLink", "Tabs", "div"]) expect(match.test(name), name).toBe(false);
    // The message has to name the fix, since the rule fires on a line that looks fine.
    expect(message).toContain("href");
  });

  /**
   * The palette rule and the hex rule are both about undeclared colour, and they
   * covered different properties: `from-[#b1976b]` was legal beside a
   * `from-amber-500` that was not. One consumer kept its brand bronze in exactly
   * that gap. Both read one list now, and this holds them to it.
   */
  it("catches a hex on every colour utility, gradient stops included", () => {
    const hex = messageWith("Hex colours");
    expect(hex.length).toBeGreaterThan(0);
    expect(patterns(hex).length).toBeGreaterThan(0);
    for (const pattern of patterns(hex)) {
      const re = new RegExp(pattern);
      for (const cls of [
        " from-[#b1976b]",
        " via-[#b1976b]",
        " to-[#b1976b]",
        " text-[#fff]",
        " bg-[#fff]",
        " shadow-[#fff]",
        " dark:from-[#b1976b]",
        " md:via-[#b1976b]",
      ]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(true);
      }
      // A token is the whole point of the rule, so it has to survive it.
      expect(re.test(" from-brand"), pattern).toBe(false);
    }
  });

  /**
   * The rung rule was px-only, on the reasoning that a rem value at display scale
   * is an ornament. An ornament is still a size nothing else can reach for, and a
   * 10rem quote glyph shipped twice in one consumer under the exemption.
   */
  it("catches an arbitrary font size in any unit, and leaves a colour alone", () => {
    const sizes = messageWith("bypass the type ramp");
    expect(sizes.length).toBeGreaterThan(0);
    expect(patterns(sizes).length).toBeGreaterThan(0);
    for (const pattern of patterns(sizes)) {
      const re = new RegExp(pattern);
      for (const cls of [
        " text-[13px]",
        " text-[10rem]",
        " text-[2em]",
        " lg:text-[2rem]",
      ]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(true);
      }
      // The package writes its own ink this way and anything copying it does too:
      // a bracket after `text-` is a size only when a number opens it.
      expect(re.test(" text-[color:var(--ink,var(--foreground))]"), pattern).toBe(
        false,
      );
      expect(re.test(" text-9xl"), pattern).toBe(false);
    }
  });

  /**
   * llms.txt opens on "never write type styles by hand" and nothing enforced it.
   * Every other type rule catches a bad value; this one catches the case where
   * each value is fine and the primitive was skipped.
   */
  it("catches a hand-written type style on a text element, and only there", () => {
    const hand = designRules().filter((r) => r.message.includes("written by hand"));
    expect(hand.length).toBeGreaterThan(0);
    for (const { selector } of hand) {
      const tags = /name\.name=\/\^\((.*?)\)\$\//.exec(selector)?.[1];
      expect(tags, selector).toBeTruthy();
      const match = new RegExp(`^(${tags})$`);
      // Text by definition, so a rung on one has no second reading.
      for (const tag of ["p", "h1", "h2", "h3", "h4", "h5", "h6"]) {
        expect(match.test(tag), tag).toBe(true);
      }
      // A span or a div with a rung is as often a layout box or a wrapper round
      // something that is not text: on real code that reading was 166 hits to
      // this one's ten, so the precision here comes from the element.
      for (const tag of ["span", "div", "li", "td", "TypographyP"]) {
        expect(match.test(tag), tag).toBe(false);
      }
      const pattern = /\[value(?:\.raw)?=\/(.*)\/\]$/.exec(selector)?.[1];
      expect(pattern, selector).toBeTruthy();
      const re = new RegExp(pattern!);
      for (const cls of [
        "text-sm",
        "mb-2 text-xs uppercase text-muted-foreground",
        "mt-2 font-mono text-xs text-muted-foreground",
        "text-lg font-semibold",
        "leading-tight",
      ]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(true);
      }
      // Spacing and layout on a paragraph are not type styles.
      for (const cls of ["mb-4", "mt-2 flex items-center gap-2", "font-mono"]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(false);
      }
    }
  });

  /**
   * The blind spot: every colour rule reads a className, so a hex in `style`
   * has nothing looking at it. Off by default because Satori cannot resolve a
   * custom property, and this package's own `ogCard` takes hex for that reason.
   */
  it("leaves a colour in a style object alone until asked", () => {
    const off = designRules().filter((r) => r.message.includes("style object"));
    expect(off.length).toBe(0);
    const on = designRules({ inlineStyle: true }).filter((r) =>
      r.message.includes("style object"),
    );
    expect(on.length).toBeGreaterThan(0);
    for (const { selector } of on) {
      expect(selector).toContain('JSXAttribute[name.name="style"]');
      const pattern = /\[value=\/(.*)\/\]$/.exec(selector)?.[1];
      expect(pattern, selector).toBeTruthy();
      const re = new RegExp(pattern!);
      for (const v of ["#272B35", "#fff", "1px solid #b1976b"]) {
        expect(re.test(v), v).toBe(true);
      }
      // The sanctioned form, and what inkOnSurfaceStyle returns.
      for (const v of ["var(--brand)", "var(--ink, var(--foreground))", "12px"]) {
        expect(re.test(v), v).toBe(false);
      }
    }
  });

  /**
   * The nudge the alignment primitives replace. `CAP_TRIM` and `ON_FIRST_LINE`
   * shipped in 0.2 with nothing pointing at them, and one consumer carried 84
   * hand-tuned margins that never heard about either.
   */
  it("catches a margin on an inline mark, in either order", () => {
    const align = messageWith("nudge that fits one rung");
    expect(align.length).toBeGreaterThan(0);
    expect(patterns(align).length).toBeGreaterThan(0);
    for (const pattern of patterns(align)) {
      const re = new RegExp(pattern);
      for (const cls of [
        "w-4 h-4 mr-1 -mt-0.5 inline",
        "inline mr-1 -mt-1",
        "inline mt-1.5",
        "h-4 w-4 lg:h-5 lg:w-5 inline -mt-1 mr-1",
      ]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(true);
      }
      // `inline-flex` and friends are block-level boxes, where a top margin is
      // spacing rather than a nudge. Missing this fired on five correct call sites.
      for (const cls of [
        "mt-4 inline-flex items-center gap-1.5",
        "mt-3 inline-block",
        "mt-2 inline-grid",
        // Neither half on its own is the mistake.
        "inline h-4 w-4 align-middle",
        "mt-4 flex items-start",
      ]) {
        expect(re.test(cls), `${cls} in ${pattern}`).toBe(false);
      }
    }
  });
});

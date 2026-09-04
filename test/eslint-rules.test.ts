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
});

import { describe, expect, it } from "vitest";
import {
  colourRules,
  typographyRules,
  themeOverrideRules,
  surfaceAsInkRules,
  designConfig,
} from "../dist/eslint.js";

/** Every rule is a selector plus a message, which is all ESLint is handed. */
const allRules = () => [
  ...colourRules(),
  ...typographyRules({ weights: true }),
  ...themeOverrideRules(),
  ...surfaceAsInkRules(),
];

/** The regex inside a `Literal[value=/…/]` selector, as esquery would read it. */
const patterns = (rules: { selector: string }[]) =>
  rules
    .map((r) => /\[value=\/(.*)\/[a-z]*\]$/.exec(r.selector)?.[1])
    .filter((p): p is string => Boolean(p));

describe("rule shape", () => {
  it("gives every rule a selector and a message", () => {
    for (const rule of allRules()) {
      expect(rule.selector, JSON.stringify(rule)).toBeTruthy();
      expect(rule.message, rule.selector).toBeTruthy();
    }
  });

  it("never writes a literal / inside a pattern, which esquery truncates at", () => {
    // ESLint 8's bundled esquery ends a pattern at the first slash it sees,
    // however it is escaped, and hands RegExp the truncated half. Escapes have
    // to be written \x2f.
    for (const pattern of patterns(allRules())) {
      expect(pattern.includes("/"), pattern).toBe(false);
    }
  });

  it("compiles every embedded pattern", () => {
    const found = patterns(allRules());
    expect(found.length).toBeGreaterThan(0);
    for (const pattern of found) expect(() => new RegExp(pattern)).not.toThrow();
  });
});

describe("colourRules", () => {
  it("puts the caller's accent names in the message", () => {
    const [first] = colourRules({ accents: "the brand tints" });
    expect(first.message).toContain("the brand tints");
  });

  it("has a default so the argument is optional", () => {
    expect(colourRules()[0].message).toContain("a brand accent");
  });
});

describe("typographyRules", () => {
  it("leaves the weight rule out by default", () => {
    const withWeights = JSON.stringify(typographyRules({ weights: true }));
    const without = JSON.stringify(typographyRules());
    expect(withWeights.length).toBeGreaterThan(without.length);
  });

  it("quotes the ramp back in the message when given one", () => {
    const rules = typographyRules({ ramp: "text-xs 12 / text-sm 13" });
    expect(JSON.stringify(rules)).toContain("text-xs 12");
  });
});

describe("the rules that take no options", () => {
  it("returns the same set every call, since nothing varies per app", () => {
    expect(themeOverrideRules()).toEqual(themeOverrideRules());
    expect(surfaceAsInkRules()).toEqual(surfaceAsInkRules());
  });

  it("restricts the solid dark: form and leaves an alpha scrim alone", () => {
    const solid = JSON.stringify(themeOverrideRules());
    // `dark:bg-destructive/20` against a `/10` is the same token at a different
    // density, so the patterns must not match a value carrying an alpha suffix.
    for (const pattern of patterns(themeOverrideRules())) {
      const re = new RegExp(pattern);
      expect(re.test(" dark:bg-destructive/20"), pattern).toBe(false);
    }
    expect(solid).toContain("dark:");
  });
});

describe("designConfig", () => {
  it("is one flat-config entry holding one no-restricted-syntax rule", () => {
    const config = designConfig();
    expect(config).toHaveLength(1);
    expect(Object.keys(config[0].rules)).toEqual(["no-restricted-syntax"]);
    expect(config[0].name).toBe("@supertype/foundations/design");
  });

  it("carries every rule, since a second entry would replace the first", () => {
    const [severity, ...rules] = designConfig()[0].rules["no-restricted-syntax"] as [string, ...object[]];
    expect(severity).toBe("error");
    expect(rules).toHaveLength(
      colourRules().length +
        typographyRules().length +
        themeOverrideRules().length +
        surfaceAsInkRules().length,
    );
  });

  it("passes its options through to the builders", () => {
    const config = designConfig({ accents: "the brand tints", weights: true });
    const json = JSON.stringify(config);
    expect(json).toContain("the brand tints");
    expect(json).toContain("font-semibold");
  });

  it("defaults to every source file and takes a narrower list", () => {
    expect(designConfig()[0].files).toEqual(["**/*.{ts,tsx,js,jsx}"]);
    expect(designConfig({ files: ["app/**/*.tsx"] })[0].files).toEqual(["app/**/*.tsx"]);
  });
});

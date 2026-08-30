import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  specificity,
  resolveTokens,
  parseColor,
  luminance,
  contrast,
  checkLegibility,
  checkSignals,
  formatFailures,
  tokenCuts,
} from "../dist/contrast.js";

const read = (name: string) => readFileSync(new URL(`../src/${name}`, import.meta.url), "utf8");

describe("specificity", () => {
  it("scores :root and .dark equally, which is the tie that matters", () => {
    expect(specificity(":root")).toBe(specificity(".dark"));
  });

  it("counts ids above classes", () => {
    expect(specificity("#app")).toBeGreaterThan(specificity(".dark.theme"));
  });

  it("counts a :not() argument, per spec", () => {
    expect(specificity(":root:not(.dark)")).toBe(specificity(":root") + specificity(".dark"));
  });
});

describe("parseColor", () => {
  it("reads hex, rgb and hsl", () => {
    expect(parseColor("#ffffff")).toEqual([255, 255, 255]);
    expect(parseColor("#fff")).toEqual([255, 255, 255]);
    expect(parseColor("rgb(0, 0, 0)")).toEqual([0, 0, 0]);
    expect(parseColor("hsl(0 0% 100%)")).toEqual([255, 255, 255]);
  });

  it("returns null for a value it cannot read", () => {
    expect(parseColor("var(--something)")).toBeNull();
    expect(parseColor("")).toBeNull();
  });
});

describe("contrast", () => {
  it("puts black on white at 21:1", () => {
    const ratio = contrast([0, 0, 0], [255, 255, 255]);
    expect(ratio).toBeCloseTo(21, 1);
  });

  it("is symmetric", () => {
    const a: [number, number, number] = [12, 30, 60];
    const b: [number, number, number] = [240, 240, 230];
    expect(contrast(a, b)).toBeCloseTo(contrast(b, a), 10);
  });

  it("orders luminance the way eyes do", () => {
    expect(luminance([255, 255, 255])).toBeGreaterThan(luminance([128, 128, 128]));
    expect(luminance([128, 128, 128])).toBeGreaterThan(luminance([0, 0, 0]));
  });
});

describe("resolveTokens", () => {
  const css = `
    :root { --background: #ffffff; --foreground: #111111; }
    .dark { --background: #101010; --foreground: #eeeeee; }
  `;

  it("returns the value each theme actually renders", () => {
    expect(resolveTokens(css, "light")["--background"]).toBe("#ffffff");
    expect(resolveTokens(css, "dark")["--background"]).toBe("#101010");
  });

  it("lets a later bare :root win in both themes, which is the trap it exists to catch", () => {
    const overridden = `${css}\n:root { --background: #ff0000; }`;
    expect(resolveTokens(overridden, "light")["--background"]).toBe("#ff0000");
    // .dark ties on specificity and loses on order, so dark mode goes light too.
    expect(resolveTokens(overridden, "dark")["--background"]).toBe("#ff0000");
  });

  it("ignores a descendant selector, which styles something other than the root", () => {
    const scoped = `${css}\n.dark .notes-route { --background: #00ff00; }`;
    expect(resolveTokens(scoped, "dark")["--background"]).toBe("#101010");
  });

  it("does not let a comment above a rule swallow its selector", () => {
    const commented = `
      :root { --background: #ffffff; }
      /* The dark palette. */
      .dark { --background: #101010; }
    `;
    expect(resolveTokens(commented, "dark")["--background"]).toBe("#101010");
  });
});

describe("resolveTokens with statement at-rules", () => {
  it("reads a block that follows an @source line", () => {
    const css = `@source '../node_modules/**/*.js';\n:root { --background: #ffffff; }`;
    expect(resolveTokens(css, "light")["--background"]).toBe("#ffffff");
  });

  it("strips a statement at-rule carrying parentheses", () => {
    const css = `@custom-variant dark (&:where(.dark, .dark *));\n:root { --background: #ffffff; }`;
    expect(resolveTokens(css, "light")["--background"]).toBe("#ffffff");
  });

  it("leaves a declaration whose value contains @ alone", () => {
    const css = `:root { --logo: url(sprite@2x.png); --foreground: #111111; }`;
    expect(resolveTokens(css, "light")["--foreground"]).toBe("#111111");
  });
});

describe("checkLegibility", () => {
  it("passes the package's own token layer in both themes", () => {
    const css = [read("tokens.css"), read("theme.css")].join("\n");
    const failures = checkLegibility(css);
    expect(failures, formatFailures(failures)).toEqual([]);
  });

  it("catches an ink that cannot be read on its surface", () => {
    const css = `:root { --background: #ffffff; --foreground: #f2f2f2; }`;
    const failures = checkLegibility(css, { themes: ["light"] });
    expect(failures.length).toBeGreaterThan(0);
    expect(failures[0]).toMatchObject({ theme: "light", ink: "--foreground", surface: "--background" });
    expect(formatFailures(failures)).toContain("--foreground");
  });

  it("skips a token it cannot resolve rather than calling it a failure", () => {
    const css = `:root { --background: var(--something-else); --foreground: #111111; }`;
    expect(checkLegibility(css, { themes: ["light"], surfaces: ["--background"] })).toEqual([]);
  });

  it("honours a raised minimum", () => {
    const css = `:root { --background: #ffffff; --foreground: #767676; }`;
    const opts = { themes: ["light"] as const, inks: ["--foreground"], surfaces: ["--background"] };
    expect(checkLegibility(css, { ...opts, minimum: 4.5 })).toEqual([]);
    expect(checkLegibility(css, { ...opts, minimum: 7 })).toHaveLength(1);
  });
});

describe("checkSignals", () => {
  it("holds the package's own fills, inks and labels to their own bars", () => {
    const css = [read("tokens.css"), read("theme.css")].join("\n");
    const failures = checkSignals(css);
    expect(failures, formatFailures(failures)).toEqual([]);
  });

  it("measures a fill at 3:1, not 4.5:1", () => {
    const css = `:root { --background: #ffffff; --card: #ffffff; --warn: #767676; }`;
    // 4.54:1 — over the mark bar, under the body-copy one.
    expect(checkSignals(css, { themes: ["light"] })).toEqual([]);
  });

  it("catches a fill that cannot be seen against the page", () => {
    const css = `:root { --background: #ffffff; --card: #ffffff; --warn: #f0d000; }`;
    const failures = checkSignals(css, { themes: ["light"] });
    expect(failures[0]).toMatchObject({ ink: "--warn", required: 3 });
  });

  it("measures a label against its own fill, not against the page", () => {
    const css = `:root { --background: #000000; --primary: #ffffff; --primary-foreground: #ffffff; }`;
    const failures = checkSignals(css, { themes: ["light"] });
    expect(failures).toContainEqual(
      expect.objectContaining({ ink: "--primary-foreground", surface: "--primary" }),
    );
  });
});

describe("tokenCuts", () => {
  it("reads the pair off the same set checkSignals measures", () => {
    expect(tokenCuts("destructive")).toEqual({
      fill: "--destructive",
      onFill: "--destructive-foreground",
      asInk: undefined,
    });
  });

  it("gives a categorical hue an ink and no printed label", () => {
    // These shipped as `--ochre-foreground` for a while, which reads like a label
    // printed on `--ochre` and is not one: it is the hue as words, checked at
    // 4.5:1 against the page, and printing it on its own fill measures about
    // 1.2:1 — which is what the docs site did while it trusted the suffix.
    expect(tokenCuts("ochre")).toEqual({
      fill: "--ochre",
      onFill: undefined,
      asInk: "--ochre-ink",
    });
  });

  it("does not offer the deprecated spelling as a cut", () => {
    // The alias still resolves, so nothing broke on the day of the rename. It is
    // not a cut, so nothing new can be built on it.
    expect(tokenCuts("ochre").asInk).not.toBe("--ochre-foreground");
  });

  it("gives the status hues their ink and no label", () => {
    expect(tokenCuts("warn")).toEqual({
      fill: "--warn",
      onFill: undefined,
      asInk: "--warn-ink",
    });
  });

  it("keeps all three cuts where the set really ships three", () => {
    expect(tokenCuts("secondary")).toEqual({
      fill: "--secondary",
      onFill: "--secondary-foreground",
      asInk: "--secondary-ink",
    });
  });

  it("reports a plain role as a fill on its own", () => {
    expect(tokenCuts("--border")).toEqual({
      fill: "--border",
      onFill: undefined,
      asInk: undefined,
    });
  });

  it("every cut it names is a token the theme actually defines", () => {
    const tokens = resolveTokens([read("tokens.css"), read("theme.css")].join("\n"), "light");
    const named = ["primary", "secondary", "destructive", "accent", "card", "success", "warn", "info", "ochre", "terracotta", "sage", "fig", "moss", "fern", "stone", "cocoa"];
    for (const name of named) {
      const cuts = tokenCuts(name);
      for (const cut of [cuts.fill, cuts.onFill, cuts.asInk].filter(Boolean)) {
        expect(tokens[cut as string], `${cut} is named but undefined`).toBeTruthy();
      }
    }
  });
});

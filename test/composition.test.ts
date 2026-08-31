import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  contrast,
  lc,
  luminance,
  parseColor,
  resolveTokens,
  type Rgb,
  type Theme,
} from "../dist/contrast.js";
import { TONE, INK_ON_FILL, toneClass } from "../dist/tone.js";

/**
 * `checkSignals` measures token pairs. A pair can pass while the page fails,
 * because what a reader sees is a composition: an ink the type primitive names,
 * on a fill the surface around it painted. `TypographyLabel` inside a filled
 * `Button` printed `--foreground` on `--primary` at 2.34:1 for eleven releases,
 * and every token in that sentence measured correctly on its own.
 *
 * So this walks the compositions instead. It reads the ink each primitive
 * resolves to, the fill each surface paints, and measures one against the other
 * in both themes. It is the check that makes the pair check sufficient.
 */

const read = (name: string) => readFileSync(new URL(`../src/${name}`, import.meta.url), "utf8");
const CSS = `${read("tokens.css")}\n${read("theme.css")}`;

const rgb = (value: string): Rgb => {
  const parsed = parseColor(value);
  if (!parsed) throw new Error(`unreadable colour: ${value}`);
  return parsed;
};

/** `color-mix(in oklab, hue N%, transparent)` over the page, which is what a tint is. */
const tint = (hue: Rgb, page: Rgb, alpha: number): Rgb =>
  hue.map((v, i) => Math.round(v * alpha + page[i] * (1 - alpha))) as Rgb;

/**
 * The colour a tone row assigns, read off the class list rather than restated
 * here, so a retuned tone is measured on its next run. `brand` names a token the
 * package leaves undefined, so the var() fallback chain is followed the way a
 * browser follows it: the first name that resolves wins.
 */
const toneColour = (
  tokens: Record<string, string>,
  tone: keyof typeof TONE,
  property: string,
): Rgb => {
  const match = TONE[tone].match(new RegExp(`\\[${property}:(.*?)\\]`));
  if (!match) throw new Error(`${tone} declares no ${property}`);
  const chain = [...match[1].matchAll(/--[a-z-]+/g)].map((m) => m[0]);
  const named = chain.find((token) => tokens[token]);
  if (!named) throw new Error(`${tone}'s ${property} resolves to nothing: ${match[1]}`);
  return rgb(tokens[named]);
};

/**
 * Every ink a type primitive can resolve to on an unpainted page. `--ink` is
 * unset there, so each falls back to the token named here.
 */
const PRIMITIVES: Record<string, string> = {
  "TypographyH1-H4": "--foreground",
  TypographyEyebrow: "--foreground",
  TypographyP: "--foreground",
  TypographyLabel: "--foreground",
  TypographyMuted: "--muted-foreground",
  TypographyCaption: "--muted-foreground",
  TypographyInlineCode: "--secondary-ink",
  TypographyLink: "--foreground",
};

interface Surface {
  label: string;
  fill: (t: Record<string, string>) => Rgb;
  /** The ink this surface hands down, or null where it hands down nothing. */
  ink: ((t: Record<string, string>) => Rgb) | null;
}

const SURFACES = (): Surface[] => {
  const tones = Object.keys(TONE) as (keyof typeof TONE)[];
  return [
    { label: "page", fill: (t) => rgb(t["--background"]), ink: null },
    {
      label: "Card",
      fill: (t) => rgb(t["--card"]),
      ink: (t) => rgb(t["--card-foreground"]),
    },
    ...tones.map((tone) => ({
      label: `Button/Badge solid tone="${tone}"`,
      fill: (t: Record<string, string>) => toneColour(t, tone, "--tone-fill"),
      ink: (t: Record<string, string>) => toneColour(t, tone, "--tone-ink"),
    })),
    ...tones.map((tone) => ({
      label: `Callout tone="${tone}" (veil, 5%)`,
      fill: (t: Record<string, string>) =>
        tint(toneColour(t, tone, "--tone-hue"), rgb(t["--background"]), 0.05),
      ink: null,
    })),
    ...tones.map((tone) => ({
      label: `Button soft tone="${tone}" (wash, 10%)`,
      fill: (t: Record<string, string>) =>
        tint(toneColour(t, tone, "--tone-hue"), rgb(t["--background"]), 0.1),
      ink: null,
    })),
  ];
};

const THEMES: Theme[] = ["light", "dark"];

describe("the ink a surface hands down", () => {
  it.each(THEMES)("clears 4.5:1 for every primitive on every surface, %s", (theme) => {
    const tokens = resolveTokens(CSS, theme);
    const failures: string[] = [];

    for (const surface of SURFACES()) {
      const fill = surface.fill(tokens);
      for (const [primitive, fallback] of Object.entries(PRIMITIVES)) {
        // What the primitive actually renders: the surface's ink where it
        // declares one, its own fallback where the surface hands down nothing.
        const ink = surface.ink ? surface.ink(tokens) : rgb(tokens[fallback]);
        const ratio = contrast(ink, fill);
        if (ratio < 4.5) {
          failures.push(
            `${surface.label} · ${primitive}: ${ratio.toFixed(2)}:1 (Lc ${lc(ink, fill).toFixed(1)})`,
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

describe("the one-ink rule", () => {
  it("collapses the muted rung on a fill, because a hue fill has no second one", () => {
    expect(INK_ON_FILL).toContain("[--ink-muted:var(--tone-ink)]");
  });

  it("keeps both rungs on a tinted surface", () => {
    const tokens = resolveTokens(CSS, "light");
    const card = rgb(tokens["--card"]);
    expect(contrast(rgb(tokens["--muted-foreground"]), card)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("a palette is a surface only where it paints", () => {
  it("leaves the inherited ink alone, so a tint keeps the page's", () => {
    // The failure this replaces: a Callout spends the same seven values a filled
    // button does. Promoting ink from the palette would repaint its prose.
    expect(toneClass("warn")).not.toContain("--ink:");
  });

  it("hands the ink down only from the class a fill applies", () => {
    expect(INK_ON_FILL).toContain("[--ink:var(--tone-ink)]");
  });
});

describe("no primitive pins a page ink of its own", () => {
  /**
   * The contract only holds while the type layer reads it. A preset that spells
   * `text-foreground` in its base wins over the ink its surface handed down —
   * literally the bug, restored — and the matrix above cannot see it, because it
   * measures what the surface declares rather than what the class list says.
   */
  it.each(["typography/paragraph.tsx", "typography/header.tsx"])("%s", (file) => {
    const source = read(file);
    const pinned = [...source.matchAll(/"[^"]*\btext-(foreground|muted-foreground)\b[^"]*"/g)];
    expect(pinned.map((m) => m[0])).toEqual([]);
  });
});

/**
 * A ratio is a compliance floor, so both themes can clear it while one reads
 * half as loud as the other. `--primary` did: the CTA label measured Lc 89.3 on
 * latte and 48.9 on espresso, and the link colour 79.1 against 49.2, because one
 * token served as both a fill and a run of words. Parity is the design promise —
 * "the one action on the page" has to mean the same thing in both themes — so it
 * is stated here as a number rather than left to whoever tunes the palette next.
 */
const PARITY_LC = 15;

describe("a role means the same thing in both themes", () => {
  const measure = (theme: Theme) => {
    const t = resolveTokens(CSS, theme);
    const page = rgb(t["--background"]);
    return {
      /** The label a filled control prints, against the fill under it. */
      label: lc(rgb(t["--primary-foreground"]), rgb(t["--primary"])),
      /** The same tone as words on the page: a link, an outline button. */
      words: lc(rgb(t["--primary-ink"]), page),
    };
  };

  const light = measure("light");
  const dark = measure("dark");

  it.each([
    ["the label on a filled control", light.label, dark.label],
    ["the tone read as words", light.words, dark.words],
  ])("holds %s within %i Lc across themes", (_role, a, b) => {
    expect(Math.abs(a - b)).toBeLessThanOrEqual(PARITY_LC);
  });

  it("keeps the fill legible as a mark in both", () => {
    for (const theme of THEMES) {
      const t = resolveTokens(CSS, theme);
      expect(contrast(rgb(t["--primary"]), rgb(t["--background"]))).toBeGreaterThanOrEqual(3);
    }
  });
});

/**
 * CIE lightness, so a step means the same thing at both ends of the ramp. A
 * contrast ratio between two dark greens is nearly 1:1 whatever the gap, which
 * is why the light theme's hover measured "fine" while looking like nothing.
 */
const lightness = (c: Rgb): number => {
  const y = luminance(c);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
};

/** Below this a state change reads as a rendering artefact rather than a response. */
const HOVER_LC_STEP = 5;

describe("a hover is visible in both themes", () => {
  const mix = (a: Rgb, b: Rgb, share: number): Rgb =>
    a.map((v, i) => Math.round(v * (1 - share) + b[i] * share)) as Rgb;
  const over = (fg: Rgb, bg: Rgb, alpha: number): Rgb =>
    fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha))) as Rgb;

  it.each(THEMES)("moves a filled control by %i ΔL* at least, %s", (theme) => {
    const tokens = resolveTokens(CSS, theme as Theme);
    const toward = rgb(tokens["--hover-toward"]);
    const short: string[] = [];

    for (const tone of Object.keys(TONE) as (keyof typeof TONE)[]) {
      const fill = toneColour(tokens, tone, "--tone-fill");
      const step = Math.abs(lightness(mix(fill, toward, 0.18)) - lightness(fill));
      if (step < HOVER_LC_STEP) short.push(`solid ${tone}: ${step.toFixed(1)} ΔL*`);
    }
    expect(short).toEqual([]);
  });

  it.each(THEMES)("moves a washed control too, %s", (theme) => {
    const tokens = resolveTokens(CSS, theme as Theme);
    const page = rgb(tokens["--background"]);
    const short: string[] = [];

    for (const tone of Object.keys(TONE) as (keyof typeof TONE)[]) {
      const hue = toneColour(tokens, tone, "--tone-hue");
      const step = Math.abs(
        lightness(over(hue, page, 0.2)) - lightness(over(hue, page, 0.1)),
      );
      if (step < HOVER_LC_STEP) short.push(`soft ${tone}: ${step.toFixed(1)} ΔL*`);
    }
    expect(short).toEqual([]);
  });
});

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Average is drawn at one weight. A 600 asked of it is synthesised, and a synthesised
 * serif smears its hairlines worst at exactly the display sizes editorial uses. So the
 * face and the weight are not free to drift apart: both change under `.editorial` or
 * neither does, and a literal `font-semibold` beside the face survives into editorial
 * and synthesises without anything throwing.
 *
 * Both apps read this, so the package asserts it. viably's font-tokens suite used to,
 * which meant one consumer was policing a decision it does not own and the other was
 * not policing it at all.
 */
const read = (rel: string) =>
  readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

const HEADER = read("../src/typography/header.tsx");
const TYPE_CSS = read("../src/type.css");

describe("the heading face", () => {
  it("is one string, and states no weight literally", () => {
    // One string, not one per level: the four levels compose a shared base, so the face
    // and the weight are stated once. A second here is a level that forked.
    //
    // Scoped to the heading face on purpose — TypographyEyebrow's own `font-semibold` is
    // correct, since it is sans on every surface and uppercase at 12px is the one place
    // the weight is genuinely load-bearing.
    const faces = [...HEADER.matchAll(/"([^"]*font-heading[^"]*)"/g)].map(
      ([, s]) => s,
    );
    expect(faces).toHaveLength(1);
    expect(faces[0]).toContain("font-[number:var(--heading-weight)]");
    expect(faces[0], `${faces[0]} states a weight literally`).not.toMatch(
      /font-(bold|semibold|medium|normal)\b/,
    );
  });

  it("outranks a hand-rolled weight on an editorial surface", () => {
    // Unlayered, not `@layer base` — `font-medium` is in @layer utilities, and layers beat
    // specificity. The compound half covers an element wearing both classes.
    expect(TYPE_CSS.replace(/\/\*[\s\S]*?\*\//g, "")).toMatch(
      /\.editorial\s+\.font-heading\s*,\s*\.editorial\.font-heading\s*\{\s*font-weight:\s*var\(--heading-weight\);?\s*\}/,
    );
  });
});

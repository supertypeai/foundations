import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

/**
 * A custom property this package declares must be read by this package, or by a
 * name a consumer can reach. `--prose-measure`, `--prose-leading` and
 * `--prose-gap` shipped for twenty-two releases declared, documented in five
 * places, and consumed nowhere: setting one changed nothing and reported
 * nothing. That is the failure this package exists to catch, so it is checked
 * here rather than trusted.
 */

const src = fileURLToPath(new URL("../src/", import.meta.url));

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const FILES = walk(src).filter((f) => /\.(css|tsx?)$/.test(f));
const SOURCE = FILES.map((f) => readFileSync(f, "utf8")).join("\n");

/** `--foo: value`, the declarations. Excludes `var(--foo)`, which is a read. */
const declared = (css: string) =>
  [...css.matchAll(/(?<!var\()\s(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]);

/**
 * Every way a declared property earns its keep:
 *   var(--foo)              read directly, in CSS or in a component
 *   --color-x: var(--foo)   mapped into Tailwind's theme, which generates the
 *                           utilities a consumer writes
 *   --text-foo / --font-foo Tailwind reads the @theme namespaces itself, so
 *                           there is no var() to find
 */
const THEME_NAMESPACES = /^--(text|font|color|shadow|radius|breakpoint|container|leading|tracking|spacing|animate|ease|blur|perspective)-/;

/**
 * `var(--x)` and `var(--x, fallback)` are both reads. Only the first counted
 * until `--hover-toward` shipped read one way and reported dead the other.
 */
const isRead = (property: string) =>
  new RegExp(`var\\(\\s*${property}\\s*[,)]`).test(SOURCE) ||
  THEME_NAMESPACES.test(property);

describe("token liveness", () => {
  it("finds the properties to check", () => {
    // A regex that silently matched nothing would make every assertion below
    // pass. Anchor it on a property that is unambiguously declared.
    expect(declared(readFileSync(join(src, "theme.css"), "utf8"))).toContain("--background");
  });

  it("reads every custom property it declares", () => {
    const dead = [...new Set(FILES.flatMap((f) => declared(readFileSync(f, "utf8"))))]
      .filter((property) => !isRead(property))
      .sort();

    expect(
      dead,
      `Declared but never read. Either wire it up or delete it — a knob the ` +
        `docs promise and nothing consumes fails silently:\n  ${dead.join("\n  ")}`,
    ).toEqual([]);
  });
});

/**
 * tokens.css names the roles and theme.css paints them. A role registered with
 * no value anywhere resolves to nothing: `bg-background` renders transparent,
 * with no error and no failing build.
 */
describe("role coverage", () => {
  const roles = [
    ...readFileSync(join(src, "tokens.css"), "utf8").matchAll(
      /--color-[a-z0-9-]+:\s*var\((--[a-z0-9-]+)\)/gi,
    ),
  ].map((m) => m[1]);

  it("registers the roles", () => {
    expect(roles).toContain("--background");
  });

  it("gives every role a value in theme.css", () => {
    const painted = new Set(declared(readFileSync(join(src, "theme.css"), "utf8")));
    const unpainted = roles.filter((role) => !painted.has(role));

    expect(
      unpainted,
      `Registered in tokens.css, painted nowhere. The utility generates and ` +
        `resolves to nothing:\n  ${unpainted.join("\n  ")}`,
    ).toEqual([]);
  });
});

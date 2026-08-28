import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * Runs the type-level assertions in test/types/. Each `@ts-expect-error` there
 * asserts that the line below it does not compile; if one starts compiling,
 * TypeScript reports the unused directive and this fails.
 */
describe("type assertions", () => {
  it("compiles test/types with every @ts-expect-error still earning its place", () => {
    let output = "";
    let failed = false;
    try {
      execFileSync("npx", ["tsc", "-p", "tsconfig.typetest.json"], { cwd: root, encoding: "utf8" });
    } catch (err: any) {
      failed = true;
      output = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    }
    expect(output).toBe("");
    expect(failed).toBe(false);
  });
});

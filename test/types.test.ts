import { execFileSync } from "node:child_process";
import { join } from "node:path";
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
      // The local binary rather than `npx`: npx is the npm CLI, which warns on
      // the npm_config_* vars yarn injects into the child environment.
      execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", "tsconfig.typetest.json"], {
        cwd: root,
        encoding: "utf8",
      });
    } catch (err: any) {
      failed = true;
      output = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    }
    expect(output).toBe("");
    expect(failed).toBe(false);
  });
});

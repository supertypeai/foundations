import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // `next-view-transitions` reaches for `next/link`, which only resolves
    // through a bundler. Anything under test wants the identity of `Link`,
    // never its behaviour, so the suite runs against a stub.
    alias: {
      "next-view-transitions": fileURLToPath(
        new URL("./test/fixtures/next-view-transitions.ts", import.meta.url),
      ),
    },
    // Only this package's own suite. examples/site has its own toolchain.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    // The CLI tests spawn a process per case, which is slower than a unit test
    // and still well under a second.
    testTimeout: 20_000,
  },
});

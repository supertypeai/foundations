import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only this package's own suite. examples/site has its own toolchain.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    // The CLI tests spawn a process per case, which is slower than a unit test
    // and still well under a second.
    testTimeout: 20_000,
  },
});

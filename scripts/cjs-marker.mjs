#!/usr/bin/env node
/**
 * Marks dist/cjs as CommonJS. The package is `"type": "module"`, so without this
 * Node reads the .js files under it as ESM and `require()` throws.
 */
import { writeFileSync } from "node:fs";

writeFileSync(
  new URL("../dist/cjs/package.json", import.meta.url),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);

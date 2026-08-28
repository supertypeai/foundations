#!/usr/bin/env node
/**
 * A recipe has to compile after someone copies it into their own app.
 *
 * As soon as one reaches for a helper that lives in this site (a relative
 * import, an `@/` alias) it still renders fine here and breaks for whoever
 * pastes it. Easier to catch at build time. Runs as `prebuild`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../app/_recipes", import.meta.url));
const LOCAL = /from\s+["'](\.\.?\/|@\/)/;

const offenders = readdirSync(dir)
  .filter((file) => file.endsWith(".tsx"))
  .flatMap((file) => {
    const lines = readFileSync(join(dir, file), "utf8").split("\n");
    return lines
      .map((line, i) => ({ file, line: i + 1, text: line.trim() }))
      .filter(({ text }) => LOCAL.test(text));
  });

if (offenders.length) {
  console.error("\nRecipes must import only from @supertype/foundations:\n");
  for (const { file, line, text } of offenders) console.error(`  app/_recipes/${file}:${line}  ${text}`);
  console.error("\nInline the helper, or move the file to app/_demos/ if it is not a recipe.\n");
  process.exit(1);
}

console.log(`✔ ${readdirSync(dir).filter((f) => f.endsWith(".tsx")).length} recipes import only from the package`);

#!/usr/bin/env node
/**
 * Checks that llms.txt still lists every public export.
 *
 * llms.txt is written by hand, because the useful part is the guidance rather
 * than a dump of names. What rots is completeness: someone adds a component and
 * the agents reading this file never hear about it. So the prose stays manual
 * and the coverage is checked here, against the real exports of every entry
 * point as TypeScript sees them.
 *
 *   node scripts/check-llms.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

/** Every entry point that resolves to types, straight out of the exports map. */
const entries = Object.entries(pkg.exports)
  .filter(([, target]) => typeof target === "object" && target.types)
  .map(([name, target]) => [name, new URL(`../${target.types}`, import.meta.url).pathname]);

const program = ts.createProgram(
  entries.map(([, file]) => file),
  { moduleResolution: ts.ModuleResolutionKind.Bundler },
);
const checker = program.getTypeChecker();

const llms = readFileSync(new URL("../llms.txt", import.meta.url), "utf8");

const missing = [];
let total = 0;

for (const [entry, file] of entries) {
  const source = program.getSourceFile(file);
  const symbol = source && checker.getSymbolAtLocation(source);
  if (!symbol) continue;

  for (const exported of checker.getExportsOfModule(symbol)) {
    const name = exported.getName();
    total += 1;
    // Word boundary, so `Card` does not match inside `CardHeader`.
    if (!new RegExp(`\\b${name}\\b`).test(llms)) missing.push(`${entry} → ${name}`);
  }
}

if (missing.length) {
  console.error(`\nllms.txt does not mention ${missing.length} of ${total} exports:\n`);
  for (const line of missing) console.error(`  ${line}`);
  console.error("\nAdd them to the entry points table, and to the lookup table if an app would reach for one.\n");
  process.exit(1);
}

console.log(`✔ llms.txt covers all ${total} exports across ${entries.length} entry points`);

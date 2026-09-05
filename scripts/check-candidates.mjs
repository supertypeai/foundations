#!/usr/bin/env node
/**
 * Checks that no built file hands Tailwind a class it cannot resolve. Tailwind
 * reads `dist/**\/*.js` as plain text, so `[--ink:var(${ink})]` becomes a
 * declaration that is not CSS and every consumer's dev server fails to parse it.
 * The quieter half is a class the scanner never sees: no error, no style.
 *
 *   node scripts/check-candidates.mjs
 */
import { readFileSync } from "node:fs";
import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * An arbitrary property or value carrying an interpolation. The colon is what
 * makes it a utility rather than a variant: `dist/eslint.js` builds selectors like
 * `[value=${pattern}]`, which Tailwind leaves alone since an attribute selector is
 * only a candidate when something follows the `]`.
 */
const UNRESOLVED = /\[[^\]\s"'`]*:[^\]\s"'`]*\$\{[^}]*\}[^\]\s"'`]*\]/g;

const offences = [];

for await (const file of glob("dist/**/*.js", { cwd: root })) {
  const source = readFileSync(new URL(file, new URL("../", import.meta.url)), "utf8");
  source.split("\n").forEach((line, i) => {
    for (const [candidate] of line.matchAll(UNRESOLVED)) {
      offences.push({ file, line: i + 1, candidate });
    }
  });
}

if (offences.length) {
  console.error(`\n${offences.length} unresolved Tailwind candidate(s) in dist:\n`);
  for (const { file, line, candidate } of offences) {
    console.error(`  ${file}:${line}  ${candidate}`);
  }
  console.error(
    "\nTailwind scans dist as text, so a class built at runtime is never generated" +
      "\nand its interpolation reaches the consumer's stylesheet verbatim. State the" +
      "\nclass as a literal constant, or return properties for `style` instead.\n",
  );
  process.exit(1);
}

console.log("✔ no unresolved Tailwind candidates in dist");

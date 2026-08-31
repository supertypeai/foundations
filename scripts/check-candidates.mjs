#!/usr/bin/env node
/**
 * Checks that no built file hands Tailwind a class it cannot resolve.
 *
 * A consumer's CSS entry carries `@source '.../dist/**\/*.js'`, and Tailwind v4
 * reads those files as plain text. It has no idea it is looking at JavaScript,
 * so a class assembled in a template literal is scanned verbatim: the candidate
 * `[--ink:var(${ink})]` becomes the declaration `--ink: var(${ink})`, which is
 * not CSS. Every consumer's dev server then fails to parse the stylesheet, at a
 * line number in their file rather than ours.
 *
 * The quieter half is worse. A class the scanner never sees is never generated,
 * so the component renders with a class name that matches no rule — no error,
 * no style. That is why every class string in tone.ts is a literal, and this is
 * the check that keeps it that way.
 *
 *   node scripts/check-candidates.mjs
 */
import { readFileSync } from "node:fs";
import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * An arbitrary property or value carrying an interpolation: `[` … `]` with no
 * closing bracket, whitespace or quote inside, and a `:` before the `${`.
 *
 * The colon is what makes it a utility rather than a variant. `dist/eslint.js`
 * builds ESLint selectors like `[value=${pattern}]`, which look identical to
 * this regex without it — and Tailwind leaves those alone, because an attribute
 * selector is only a candidate when something follows the `]`. Matching them
 * would make this check cry wolf on the one file that is allowed to.
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

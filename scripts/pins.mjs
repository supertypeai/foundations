#!/usr/bin/env node
/**
 * Every place that names a release tag, held to the version in package.json.
 *
 * Consumers install a git tag, so the tag is written out by hand in the install
 * instructions and in the example app's own package.json. Nothing linked those
 * to the version being released: `release.mjs` bumped package.json and left the
 * rest at whatever they said, which is how the README and the example both sat
 * two releases behind while every build stayed green. A reader copying the
 * install line got an older package than the docs they were reading.
 *
 * So the tag has one writer. This file knows where the pins are; `release.mjs`
 * rewrites them as part of the bump, and `yarn build` fails if one has drifted.
 *
 *   node scripts/pins.mjs            check, exit non-zero on a stale pin
 *   node scripts/pins.mjs --write    rewrite them to package.json's version
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));

/**
 * Where a tag can appear. Anything installable from the repo belongs here — a
 * new doc that prints an install line is only covered once it is on this list.
 */
const FILES = [
  "README.md",
  "llms.txt",
  "docs/typography.md",
  "docs/blocks.md",
  "docs/essay.md",
  "docs/tooling.md",
  "docs/cli.md",
  "docs/contributing.md",
  "examples/site/package.json",
];

/** `…/foundations.git#v0.1.22` — the tag, wherever it is written. */
const PIN = /(foundations\.git#v)(\d+\.\d+\.\d+)/g;

const write = process.argv.includes("--write");
const expected = pkg.version;

const stale = [];
let rewritten = 0;

for (const file of FILES) {
  const path = fileURLToPath(new URL(file, root));
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch {
    continue; // A doc that has been renamed is the next commit's problem.
  }

  const next = source.replace(PIN, (match, prefix, found, offset) => {
    if (found === expected) return match;
    if (!write) {
      const line = source.slice(0, offset).split("\n").length;
      stale.push(`${file}:${line}  #v${found}  (expected #v${expected})`);
      return match;
    }
    rewritten += 1;
    return `${prefix}${expected}`;
  });

  if (write && next !== source) writeFileSync(path, next);
}

if (write) {
  console.log(`✔ pins set to v${expected} (${rewritten} rewritten)`);
  process.exit(0);
}

if (stale.length) {
  console.error(
    `\nRelease tags are stale. package.json is ${expected}:\n\n  ${stale.join(
      "\n  ",
    )}\n\nRun \`node scripts/pins.mjs --write\`, or let \`yarn release\` do it.\n`,
  );
  process.exit(1);
}

console.log(`✔ every release tag reads v${expected}`);

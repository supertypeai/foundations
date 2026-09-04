#!/usr/bin/env node
/**
 * Which public exports no consumer imports.
 *
 * The package holds every CSS custom property it declares to "something reads
 * this", in test/tokens-live.test.ts, and held nothing to it for exports. So
 * `formatOffsets` shipped, was documented in two places, and was called by
 * nobody, and a hand-run grep over two of the three consumers reported half a
 * dozen live components as dead. Both are the same defect: the consumer list
 * lived in somebody's head.
 *
 * A report rather than a gate, and deliberately so. An unimported export is a
 * question, not a failure: INK_ON_FILL is the rule that keeps a nested label off
 * a 2.34:1 fill and is unused because no app has painted one yet, where
 * designConfig was unused because nothing ever wanted it. Read the list, decide
 * one at a time.
 *
 *   node scripts/consumers.mjs [root...]
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const here = fileURLToPath(new URL("..", import.meta.url));

/**
 * The apps to read, found rather than listed: `examples/site`, which every clone
 * has, plus any checkout beside this one that depends on the package, one level
 * down as well, since a monorepo keeps its apps in subdirectories. A hardcoded
 * list would be one maintainer's home directory, which is no more portable than
 * the list that was in their head.
 */
const dependsOnUs = (dir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((d) =>
      d.startsWith("@supertype.ai/foundations"),
    );
  } catch {
    return false;
  }
};

const dirs = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => join(dir, e.name));
  } catch {
    return [];
  }
};

const found = dirs(join(here, ".."))
  .filter((sibling) => sibling !== here.replace(/\/$/, ""))
  .flatMap((sibling) => (dependsOnUs(sibling) ? [sibling] : dirs(sibling).filter(dependsOnUs)));

const example = join(here, "examples", "site");
const roots = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [...(existsSync(example) ? [example] : []), ...found];

if (!roots.length) {
  console.log("No consumer found. Pass one: node scripts/consumers.mjs ../my-app");
  process.exit(0);
}
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const entries = Object.entries(pkg.exports)
  .filter(([, target]) => typeof target === "object" && target.types)
  .map(([name, target]) => [name, new URL(`../${target.types}`, import.meta.url).pathname]);

const program = ts.createProgram(
  entries.map(([, file]) => file),
  { moduleResolution: ts.ModuleResolutionKind.Bundler },
);
const checker = program.getTypeChecker();

/** Anything but a build artefact: a name inside .next is a copy of our own dist. */
const PRUNE = [".next", ".source", "node_modules", ".git"].flatMap((d) => ["-name", d, "-o"]);

const importers = (name) => {
  try {
    return execFileSync(
      "find",
      [...roots, "(", ...PRUNE.slice(0, -1), ")", "-prune", "-o", "-type", "f", "-regex", ".*\\.\\(ts\\|tsx\\|mjs\\|js\\)", "-print0"],
      { maxBuffer: 1 << 28 },
    );
  } catch {
    return Buffer.alloc(0);
  }
};

const files = String(importers()).split("\0").filter(Boolean);
const sources = files.map((f) => {
  try {
    return readFileSync(f, "utf8");
  } catch {
    return "";
  }
});

let unused = 0;
let total = 0;
let types = 0;
for (const [entry, file] of entries) {
  const source = program.getSourceFile(file);
  const symbol = source && checker.getSymbolAtLocation(source);
  if (!symbol) continue;

  const orphans = [];
  for (const exported of checker.getExportsOfModule(symbol)) {
    total += 1;
    const name = exported.getName();
    if (sources.some((text) => new RegExp(`\\b${name}\\b`).test(text))) continue;
    unused += 1;
    // A type is imported to annotate something, so one nobody annotates with is
    // the normal state rather than a question. Counted, not listed. The barrels
    // re-export, so what arrives here is an alias and has to be resolved first,
    // or every name reads as a type and the report is empty.
    const target =
      exported.getFlags() & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (target.getFlags() & ts.SymbolFlags.Value) orphans.push(name);
    else types += 1;
  }

  if (orphans.length) console.log(`\n${entry}\n  ${orphans.join("\n  ")}`);
}

console.log(
  `\n${unused - types} of ${total} exports are imported by none of these ${roots.length}` +
    `, plus ${types} types, which is not the same question:\n  ${roots.join("\n  ")}`,
);

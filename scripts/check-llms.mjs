#!/usr/bin/env node
/**
 * Checks that llms.txt still lists every public export. The prose stays manual,
 * since the useful part is guidance rather than a dump of names; what rots is
 * completeness in both directions, and a stale row is the worse half.
 *
 *   node scripts/check-llms.mjs
 */
import { globSync, readFileSync } from "node:fs";
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

/**
 * The other direction: a name the table advertises that no longer exists. Read
 * against every declaration the build emits, since a row's prose names internals
 * too. Only backticked identifiers count, so `--brand` is not a candidate.
 */
const known = new Set();
for (const file of globSync("dist/**/*.d.ts", { cwd: root })) {
  const source = readFileSync(new URL(`../dist/${file.slice(5)}`, import.meta.url), "utf8");
  for (const [, name] of source.matchAll(/export (?:declare )?(?:function|const|class|interface|type) (\w+)/g)) {
    known.add(name);
  }
  // Re-export lists, `type` ones included, which is how the barrels carry the
  // client components and how a deprecated name stays reachable.
  for (const [, list] of source.matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g)) {
    for (const part of list.split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && /^[A-Za-z_$][\w$]*$/.test(name)) known.add(name);
    }
  }
}

const stale = [];
for (const row of llms.split("\n").filter((l) => l.startsWith("| `@supertype.ai/foundations"))) {
  for (const [, name] of row.matchAll(/`([A-Za-z][A-Za-z0-9_]*)`/g)) {
    if (!known.has(name) && !stale.includes(name)) stale.push(name);
  }
}

if (stale.length) {
  console.error(`\nllms.txt advertises ${stale.length} name(s) nothing exports:\n`);
  for (const name of stale) console.error(`  ${name}`);
  console.error("\nDelete the mention, or the export came back under another name.\n");
  process.exit(1);
}

if (missing.length) {
  console.error(`\nllms.txt does not mention ${missing.length} of ${total} exports:\n`);
  for (const line of missing) console.error(`  ${line}`);
  console.error("\nAdd them to the entry points table, and to the lookup table if an app would reach for one.\n");
  process.exit(1);
}

console.log(`✔ llms.txt covers all ${total} exports across ${entries.length} entry points`);

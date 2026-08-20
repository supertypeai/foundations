#!/usr/bin/env node
/**
 * Build, bump, pack.
 *
 * The bump is part of releasing rather than a step to remember, because yarn
 * caches tarballs by path: shipping new contents under an unchanged version
 * leaves every consumer silently on the old code, and a changed file at a stable
 * path fails yarn's integrity check on the next install. One artifact per
 * version avoids both.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: "inherit", cwd: process.cwd() });

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const [major, minor, patch] = pkg.version.split(".").map(Number);
pkg.version = `${major}.${minor}.${patch + 1}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

run("yarn", ["build"]);

// Old artifacts are noise: the consumer pins one filename, and a directory of
// stale tarballs makes it easy to install a version that is not the newest.
for (const file of readdirSync(process.cwd())) {
  if (/^supertype-foundations-.*\.tgz$/.test(file)) unlinkSync(file);
}

run("yarn", ["pack", "--filename", `supertype-foundations-${pkg.version}.tgz`]);

console.log(`\n@supertype/foundations ${pkg.version}`);
console.log(
  `consumers: yarn add "@supertype/foundations@file:../foundations/supertype-foundations-${pkg.version}.tgz"`,
);

#!/usr/bin/env node
/**
 * Bump, verify, commit, tag, push.
 *
 * Consumers install straight from the git remote, so a release is a tag rather
 * than an artifact. The bump is part of releasing rather than a step to
 * remember: yarn pins the resolved commit, and a tag that moves after the fact
 * leaves consumers on code nobody chose. One tag per version avoids that.
 *
 * dist/ is committed rather than rebuilt by a `prepare` script on the consumer
 * side. A prepare step makes every consumer run a nested `yarn install` that
 * shares one cache with the install that spawned it, and the two race on any
 * package both need — which corrupted the cache and failed CI. Shipping the
 * build output means a consumer clones a package that is already usable.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: "inherit", cwd: process.cwd() });
const capture = (cmd, args) =>
  execFileSync(cmd, args, { encoding: "utf8", cwd: process.cwd() }).trim();

const die = (msg) => {
  console.error(`\nrelease aborted: ${msg}\n`);
  process.exit(1);
};

// A dirty tree would fold unrelated edits into the release commit, so the
// version bump is the only thing the tag can differ by.
if (capture("git", ["status", "--porcelain"])) {
  die("working tree has uncommitted changes; commit or stash them first");
}

const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const [major, minor, patch] = pkg.version.split(".").map(Number);
const version = `${major}.${minor}.${patch + 1}`;
const tag = `v${version}`;

if (capture("git", ["tag", "--list", tag])) {
  die(`tag ${tag} already exists`);
}

// Compile before committing: dist/ ships in the tag, so a stale or broken build
// is what consumers would install, and they would find out at their own runtime.
// `yarn test` builds first, then runs the suite against the output that ships.
run("yarn", ["test"]);

// Tarballs are leftovers from the file: protocol. An unreferenced artifact in
// the repo root is an invitation to install a version nobody is publishing.
for (const file of readdirSync(process.cwd())) {
  if (/^supertype-foundations-.*\.tgz$/.test(file)) unlinkSync(file);
}

pkg.version = version;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// -A so a source file that stops emitting takes its stale output with it.
run("git", ["add", "package.json"]);
run("git", ["add", "-A", "dist"]);
run("git", ["commit", "-m", `release ${tag}`]);
run("git", ["tag", tag]);
run("git", ["push", "origin", branch]);
run("git", ["push", "origin", tag]);

const remote = capture("git", ["remote", "get-url", "origin"])
  .replace(/^git@github\.com:/, "https://github.com/")
  .replace(/\.git$/, "");

console.log(`\n@supertype/foundations ${tag} pushed to ${branch}`);
console.log(
  `consumers: yarn add "@supertype/foundations@${remote}.git#${tag}"`,
);

#!/usr/bin/env node
/**
 * Bump, verify, commit, tag, push, publish.
 *
 * A release is a tag and a registry version, and they have to be the same
 * commit. Consumers install from npm; the git remote still resolves for anyone
 * pinning a commit ahead of a release. The bump is part of releasing rather
 * than a step to remember: yarn pins the resolved commit, and a tag that moves
 * after the fact leaves consumers on code nobody chose. One tag per version
 * avoids that, and `npm publish` refuses a version it already has, so the two
 * cannot drift apart without the release failing.
 *
 * dist/ is committed rather than rebuilt by a `prepare` script on the consumer
 * side. A prepare step makes every consumer run a nested `yarn install` that
 * shares one cache with the install that spawned it, and the two race on any
 * package both need — which corrupted the cache and failed CI. Shipping the
 * build output means a consumer clones a package that is already usable.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";

/** Staged alongside the bump. scripts/pins.mjs is what actually rewrites them. */
const PIN_FILES = ["README.md", "llms.txt", "docs", "examples/site/package.json"];

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: "inherit", cwd: process.cwd() });
const capture = (cmd, args) =>
  execFileSync(cmd, args, { encoding: "utf8", cwd: process.cwd() }).trim();

/**
 * npm, with yarn's registry out of the way.
 *
 * `yarn run` exports `npm_config_registry=https://registry.yarnpkg.com` into
 * every script it starts, and npm reads it. The auth token in ~/.npmrc is
 * scoped to `//registry.npmjs.org/`, so npm looks up credentials for a host it
 * has none for and reports ENEEDAUTH — while the same `npm whoami` outside
 * yarn succeeds, which makes it look like the login did not take. Both npm
 * calls below name the registry themselves and drop the inherited value.
 */
const REGISTRY = "https://registry.npmjs.org/";
const npmEnv = () => {
  const env = { ...process.env };
  delete env.npm_config_registry;
  return env;
};
const npm = (args) =>
  execFileSync("npm", [...args, "--registry", REGISTRY], {
    stdio: "inherit",
    cwd: process.cwd(),
    env: npmEnv(),
  });
const npmCapture = (args) =>
  execFileSync("npm", [...args, "--registry", REGISTRY], {
    encoding: "utf8",
    cwd: process.cwd(),
    env: npmEnv(),
  }).trim();

const die = (msg) => {
  console.error(`\nrelease aborted: ${msg}\n`);
  process.exit(1);
};

// A dirty tree would fold unrelated edits into the release commit, so the
// version bump is the only thing the tag can differ by.
if (capture("git", ["status", "--porcelain"])) {
  die("working tree has uncommitted changes; commit or stash them first");
}

// Checked before anything is built, committed or pushed: an unauthenticated
// publish fails at the last step of the release, with the tag already on the
// remote and no version behind it. Better to find out now.
try {
  npmCapture(["whoami"]);
} catch {
  die("not logged in to npm; run `npm login` first");
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
  if (/^supertype\.ai-foundations-.*\.tgz$/.test(file)) unlinkSync(file);
}

pkg.version = version;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// The install instructions and the example app name the tag by hand. They are
// rewritten here, in the same commit that creates it, because a pin updated
// afterwards is a pin that gets forgotten — and `yarn build` fails on a stale
// one, so forgetting would break the next build rather than this release.
run("node", ["scripts/pins.mjs", "--write"]);

// -A so a source file that stops emitting takes its stale output with it.
run("git", ["add", "package.json", ...PIN_FILES]);
run("git", ["add", "-A", "dist"]);
run("git", ["commit", "-m", `release ${tag}`]);
run("git", ["tag", tag]);
run("git", ["push", "origin", branch]);
run("git", ["push", "origin", tag]);

// The tag exists, so the commit behind the registry version is now nameable.
// `prepublishOnly` rebuilds, which is redundant after `yarn test` above and
// cheap insurance against publishing by hand from a stale tree.
npm(["publish"]);

// The example's lockfile keys on the exact pin spec and resolves to the commit
// the tag points at, so it cannot live inside that commit — it is only
// resolvable once the tag is pushed. Without this the pin and the lockfile
// disagree and `yarn install --frozen-lockfile`, which is how both workflows
// install, fails on the next push.
run("yarn", ["--cwd", "examples/site", "install"]);
if (capture("git", ["status", "--porcelain", "examples/site/yarn.lock"]).trim()) {
  run("git", ["add", "examples/site/yarn.lock"]);
  run("git", ["commit", "-m", `lock examples/site to ${tag}`]);
  run("git", ["push", "origin", branch]);
}

const remote = capture("git", ["remote", "get-url", "origin"])
  .replace(/^git@github\.com:/, "https://github.com/")
  .replace(/\.git$/, "");

console.log(`\n@supertype.ai/foundations ${tag} pushed to ${branch} and published`);
console.log(`consumers: yarn add @supertype.ai/foundations`);
console.log(`   or pin: yarn add "@supertype.ai/foundations@${remote}.git#${tag}"`);

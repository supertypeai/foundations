#!/usr/bin/env node
/**
 * Build and copy this package into a consumer's node_modules, so a change can be
 * seen in ssite or viably without cutting a tag.
 *
 * Consumers pin a git tag (see release.mjs), and that stays true in every
 * environment they deploy from: this script never touches their package.json or
 * lockfile. It overwrites the *installed copy* under node_modules, which is
 * gitignored and rebuilt by `yarn install` — so a stale sync cannot escape the
 * machine it happened on, and CI keeps installing the tag.
 *
 * A symlink (yarn link) would be the shorter route, but it puts a second React
 * on the resolution path for a package with react as a peer, and Next hits that
 * as an invalid-hook-call at runtime. Copying keeps one node_modules tree.
 *
 *   node scripts/sync.mjs                 build once, copy to every target
 *   node scripts/sync.mjs --watch         rebuild and copy on every src change
 *   node scripts/sync.mjs ../other-app    copy to a target given explicitly
 *
 * Turbopack and webpack both cache node_modules aggressively; a sync lands in
 * the running dev server only after it restarts. --watch prints the reminder.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync, watch } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * Where the package lands in each consumer. The two machines this runs on keep
 * the repos under different roots, so each consumer is looked up in both and
 * the one that exists wins. Override by passing paths as args.
 */
const CONSUMER_ROOTS = ["Work", "fun"].map((dir) => join(homedir(), dir));
const CONSUMER_PATHS = ["ssite", "viably/on_next"];

/** First root that actually holds this consumer, or its path under the first root. */
const locate = (rel) => {
  const found = CONSUMER_ROOTS.map((base) => join(base, rel)).find((dir) => existsSync(dir));
  return found ?? join(CONSUMER_ROOTS[0], rel);
};

const DEFAULT_TARGETS = CONSUMER_PATHS.map(locate);

/**
 * Everything a consumer resolves: dist/ for the exports map, src/ for the CSS
 * entry points it imports by path, bin/ for the doctor, llms.txt for whatever
 * coding agent the consumer runs. node_modules inside the installed copy is left
 * alone, since it holds the package's own deps, which yarn put there.
 */
const PAYLOAD = ["dist", "src", "bin", "llms.txt", "package.json", "README.md"];

const args = process.argv.slice(2);
const watching = args.includes("--watch");
const targets = args.filter((a) => !a.startsWith("--"));

const consumers = (targets.length ? targets.map((t) => resolve(t)) : DEFAULT_TARGETS)
  .map((dir) => ({ dir, dest: join(dir, "node_modules/@supertype/foundations") }))
  .filter(({ dir, dest }) => {
    // A missing dest means the consumer never installed us, and creating one by
    // hand would leave a package yarn does not know about.
    if (existsSync(dest)) return true;
    console.warn(`skipped ${dir}: no node_modules/@supertype/foundations (run yarn install there first)`);
    return false;
  });

if (!consumers.length) {
  console.error("no consumers to sync");
  process.exit(1);
}

const build = () =>
  execFileSync("yarn", ["build"], { cwd: root, stdio: "inherit" });

const copy = () => {
  for (const { dest } of consumers) {
    for (const entry of PAYLOAD) {
      const from = join(root, entry);
      if (!existsSync(from)) continue;
      const to = join(dest, entry);
      // Remove first: cpSync merges, so a file that stopped being emitted would
      // linger and keep resolving.
      if (!entry.includes(".")) rmSync(to, { recursive: true, force: true });
      cpSync(from, to, { recursive: true });
    }
    console.log(`synced → ${dest}`);
  }
};

const sync = () => {
  try {
    build();
    copy();
  } catch (err) {
    // In watch mode a type error is a normal part of editing; keep the watcher
    // alive so the next save can fix it.
    if (!watching) throw err;
    console.error("build failed; watching for the next change");
  }
};

sync();

if (watching) {
  console.log("\nwatching src/ — restart the consumer's dev server to pick a sync up\n");
  let pending;
  watch(join(root, "src"), { recursive: true }, () => {
    clearTimeout(pending); // Editors write in bursts; one build per burst.
    pending = setTimeout(sync, 150);
  });
}

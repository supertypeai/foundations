#!/usr/bin/env node
/**
 * Builds the example against the package it actually installed, with no sync,
 * and runs the installed doctor over it. `yarn example:build` overwrites that
 * tree with main, which is what makes the docs useful and what makes them
 * useless as proof — so this refuses to run on a tree that has been synced.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { SYNC_MARKER } from "./sync.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const app = join(root, "examples/site");
const installed = join(app, "node_modules/@supertype.ai/foundations");

if (!existsSync(installed)) {
  console.error("examples/site has no installed package. Run `yarn example:install` first.");
  process.exit(1);
}

if (existsSync(join(installed, SYNC_MARKER))) {
  console.error(
    "examples/site is running a synced build of main, not the pinned tag.\n" +
      "Reinstall before claiming a pinned build:\n" +
      "  yarn --cwd examples/site install --force",
  );
  process.exit(1);
}

const { version } = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"));
const spec = JSON.parse(readFileSync(join(app, "package.json"), "utf8"))
  .dependencies["@supertype.ai/foundations"];
console.log(`building examples/site against ${spec} (v${version})\n`);

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: "inherit" });
run("yarn", ["build"], app);
run("node", [join(installed, "bin/foundations.mjs"), "doctor", "--cwd", app], root);

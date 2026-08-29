import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));

/**
 * Two facts that look like one, which is how they drifted.
 *
 * "What should a reader install?" is answered by this app's own dependency —
 * the exact string, not a version and a URL rebuilt around it. The page then
 * prints the line the example itself installs from, so an install command that
 * stops being true stops being true here first. `scripts/pins.mjs` in the
 * package holds that string to the version being released and fails the build
 * when it drifts, so the tag has one writer and this reads it.
 *
 * "What is this site running?" is a different question, and the answer is not
 * the pin: `yarn example` and the docs workflow both sync a build of main over
 * the installed tag, which is the point of them. So it comes off the installed
 * copy, where it is a measurement rather than a claim.
 */
const app = read("package.json") as { dependencies: Record<string, string> };
const installed = read("node_modules/@supertype.ai/foundations/package.json") as {
  version: string;
};

export const INSTALL_SPEC = app.dependencies["@supertype.ai/foundations"];
export const INSTALLED_VERSION = `v${installed.version}`;

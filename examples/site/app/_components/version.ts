import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));

/**
 * Two facts that look like one: the spec a reader should install, held to the
 * release by scripts/pins.mjs, and the build this site is actually running.
 */
const app = read("package.json") as { dependencies: Record<string, string> };
const installed = read("node_modules/@supertype.ai/foundations/package.json") as {
  version: string;
};

export const INSTALL_SPEC = app.dependencies["@supertype.ai/foundations"];
export const INSTALLED_VERSION = `v${installed.version}`;

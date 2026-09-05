import app from "@/package.json";
import installed from "@supertype.ai/foundations/package.json";

/**
 * Two facts that look like one: the spec a reader should install, held to the
 * release by scripts/pins.mjs, and the build this site is actually running.
 *
 * Imports, not `readFileSync`: Turbopack traces a cwd-relative read as the
 * whole project.
 */
export const INSTALL_SPEC = app.dependencies["@supertype.ai/foundations"];
export const INSTALLED_VERSION = `v${installed.version}`;

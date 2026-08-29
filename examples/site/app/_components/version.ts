import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The tag this site is actually running, read from the installed copy at build
 * time rather than typed into the page.
 *
 * The install command is the first thing a reader copies, and a hand-written tag
 * in it goes stale on the next release without anything failing — they end up on
 * an older package than the one the docs demonstrate. Reading the version the
 * site itself resolved keeps the two the same by construction.
 */
const pkg = JSON.parse(
  readFileSync(
    join(process.cwd(), "node_modules/@supertype/foundations/package.json"),
    "utf8",
  ),
) as { version: string };

export const INSTALLED_VERSION = `v${pkg.version}`;
export const INSTALL_SPEC = `https://github.com/supertypeai/foundations.git#${INSTALLED_VERSION}`;

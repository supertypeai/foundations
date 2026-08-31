import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The `llms.txt` this site's own install resolved, read at build time so the
 * excerpts on the agents page cannot drift from the file they quote.
 */
const INSTALLED = join(process.cwd(), "node_modules/@supertype.ai/foundations");

const SOURCE = readFileSync(join(INSTALLED, "llms.txt"), "utf8");

const pkg = JSON.parse(readFileSync(join(INSTALLED, "package.json"), "utf8")) as {
  exports: Record<string, unknown>;
};

/** Entry points the coverage check walks: the ones in the exports map with types. */
export const LLMS_ENTRY_POINTS = Object.values(pkg.exports).filter(
  (target) => typeof target === "object" && target !== null && "types" in target,
).length;

export const LLMS_LINES = SOURCE.trimEnd().split("\n").length;

/** Every `##` heading in the file, in order. */
export const LLMS_SECTIONS = [...SOURCE.matchAll(/^## (.+)$/gm)].map((m) => m[1]);

/** One `##` section, heading included, for quoting verbatim. */
export function llmsSection(heading: string): string {
  const from = SOURCE.indexOf(`## ${heading}\n`);
  if (from === -1) throw new Error(`llms.txt has no "## ${heading}" section`);
  const rest = SOURCE.slice(from + 3 + heading.length);
  const to = rest.indexOf("\n## ");
  return `## ${heading}${to === -1 ? rest : rest.slice(0, to)}`.trim();
}

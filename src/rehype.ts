import rehypeShiki, {
  type RehypeShikiOptions,
} from "@shikijs/rehype";

/**
 * Languages compiled into the highlighter.
 *
 * Kept explicit rather than pulling Shiki's full grammar set: this runs at build
 * time (MDX is compiled server-side, so no grammar reaches the client bundle),
 * but every extra grammar is still parsing work on every build.
 *
 * Derived from the fences actually present across the consuming repos. Anything
 * not listed falls back to `text` instead of throwing — content routinely uses
 * labels that are not real grammars (`tree`, `spark-defaults`), and a build that
 * dies over a fence label is a bad trade.
 */
export const PROSE_LANGS = [
  "bash",
  "csv",
  "diff",
  "docker",
  "json",
  "python",
  "sql",
  "toml",
  "tsx",
  "typescript",
  "javascript",
  "yaml",
] as const;

export const PROSE_THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

/**
 * Shiki rehype plugin, preconfigured for the prose system.
 *
 * `defaultColor: false` makes Shiki emit `--shiki-light` / `--shiki-dark` custom
 * properties on each token rather than a hardcoded colour, which is what lets one
 * compiled document serve both themes. `shiki.css` maps those variables.
 *
 * Exported as a `[plugin, options]` tuple so it drops straight into a
 * `rehypePlugins` array:
 *
 *     rehypePlugins: [rehypeProseCode]
 */
export const proseCodeOptions: RehypeShikiOptions = {
  themes: PROSE_THEMES,
  defaultColor: false,
  langs: [...PROSE_LANGS],
  fallbackLanguage: "text",
} as RehypeShikiOptions;

// Typed as a mutable tuple, not `as const`: unified's `Pluggable` does not
// accept a readonly tuple, and a readonly one fails to assign in consumers.
export const rehypeProseCode: [typeof rehypeShiki, RehypeShikiOptions] = [
  rehypeShiki,
  proseCodeOptions,
];

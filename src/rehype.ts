import rehypeShiki, {
  type RehypeShikiOptions,
} from "@shikijs/rehype";

/**
 * Explicit rather than Shiki's full set — every grammar is build-time parsing.
 * Anything unlisted falls back to `text`: content uses labels that are not real
 * grammars (`tree`, `spark-defaults`), and dying over a fence label is a bad trade.
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
 * `defaultColor: false` emits `--shiki-light` / `--shiki-dark` per token instead
 * of a baked colour, so one compiled document serves both themes; `shiki.css`
 * maps them. A `[plugin, options]` tuple, so it drops into `rehypePlugins`.
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

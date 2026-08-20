import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
/**
 * Explicit rather than Shiki's full set — every grammar is build-time parsing.
 * Anything unlisted falls back to `text`: content uses labels that are not real
 * grammars (`tree`, `spark-defaults`), and dying over a fence label is a bad trade.
 */
export declare const PROSE_LANGS: readonly ["bash", "csv", "diff", "docker", "json", "python", "sql", "toml", "tsx", "typescript", "javascript", "yaml"];
export declare const PROSE_THEMES: {
    readonly light: "github-light";
    readonly dark: "github-dark";
};
/**
 * `defaultColor: false` emits `--shiki-light` / `--shiki-dark` per token instead
 * of a baked colour, so one compiled document serves both themes; `shiki.css`
 * maps them. A `[plugin, options]` tuple, so it drops into `rehypePlugins`.
 */
export declare const proseCodeOptions: RehypeShikiOptions;
export declare const rehypeProseCode: [typeof rehypeShiki, RehypeShikiOptions];

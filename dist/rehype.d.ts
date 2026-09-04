import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
export declare const PROSE_THEMES: {
    readonly light: "github-light";
    readonly dark: "github-dark";
};
export declare const rehypeProseCode: [typeof rehypeShiki, RehypeShikiOptions];

/**
 * Token legibility, measured against the cascade rather than the declarations.
 *
 * Reading the `:root` map and the `.dark` map separately measures an intention.
 * A consumer retuning a token on a bare `:root` ties `.dark` on specificity and
 * takes both themes — ssite shipped that, its `.dark` measuring a healthy 15.7:1
 * while the page rendered white on white. So this resolves each property the way
 * the cascade does (layer rank, specificity, source order) and measures what is
 * left standing. Build-time only: strings and numbers, no React, no DOM.
 */
export type Rgb = [number, number, number];
/** The themes a stylesheet is measured in. `dark` is the `.dark` class. */
export type Theme = "light" | "dark";
/**
 * Selector specificity, counting only what token blocks ever use: classes,
 * pseudo-classes and ids. `:root` is one pseudo-class, `.dark` one class —
 * which is the tie at the heart of the bug above.
 *
 * `:not(...)` contributes its argument's specificity rather than its own, per
 * the spec, so `:root:not(.dark)` scores 2 and outranks a bare `.dark`.
 */
export declare function specificity(selector: string): number;
/**
 * Every custom property that survives the cascade on the root element.
 *
 * `css` is the consumer's stylesheet with the package's imported ahead of it,
 * concatenated in import order — the same order the browser sees.
 */
export declare function resolveTokens(css: string, theme: Theme): Record<string, string>;
/** Parses `hsl(...)`, `#rgb`, `#rrggbb` and `rgb(...)`. Returns null otherwise. */
export declare function parseColor(value: string): Rgb | null;
/** WCAG relative luminance. */
export declare function luminance([r, g, b]: Rgb): number;
/** WCAG contrast ratio, 1:1 to 21:1. */
export declare function contrast(a: Rgb, b: Rgb): number;
export interface LegibilityFailure {
    theme: Theme;
    ink: string;
    surface: string;
    ratio: number;
    required: number;
}
/**
 * Every ink measured on every surface it can land on, in both themes.
 *
 * Pairs where either token is missing or is not a literal colour are skipped:
 * a consumer is free to leave one at the package default or to point it at
 * another variable, and neither is a contrast failure.
 */
export declare function checkLegibility(css: string, { minimum, inks, surfaces, themes, }?: {
    minimum?: number | undefined;
    inks?: string[] | undefined;
    surfaces?: string[] | undefined;
    themes?: Theme[] | undefined;
}): LegibilityFailure[];
/** A one-line report per failure, for a test's assertion message. */
export declare function formatFailures(failures: LegibilityFailure[]): string;

/**
 * Legibility measured against the cascade, not the declarations: reading `:root`
 * and `.dark` separately measures an intention, and ssite shipped a `.dark` at a
 * healthy 15.7:1 while the page rendered white on white. Build-time only.
 */
export type Rgb = [number, number, number];
/** The themes a stylesheet is measured in. `dark` is the `.dark` class. */
export type Theme = "light" | "dark";
/**
 * Specificity over what token blocks use. `:root` and `.dark` both score 1 —
 * the tie above. `:not(…)` contributes its argument's score, per spec.
 */
export declare function specificity(selector: string): number;
/** Properties surviving the cascade on :root. `css` is concatenated in import order. */
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
 * Every ink on every surface, both themes. Missing or non-literal tokens are
 * skipped — a default or an aliased variable is not a contrast failure.
 */
export declare function checkLegibility(css: string, { minimum, inks, surfaces, themes, }?: {
    minimum?: number | undefined;
    inks?: string[] | undefined;
    surfaces?: string[] | undefined;
    themes?: Theme[] | undefined;
}): LegibilityFailure[];
/** A one-line report per failure, for a test's assertion message. */
export declare function formatFailures(failures: LegibilityFailure[]): string;

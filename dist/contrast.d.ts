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
/**
 * APCA lightness contrast (Lc), the perceptual measure WCAG 3 is built on. A WCAG
 * ratio is polarity-blind, which lets a ramp be ordered by ratio and still read
 * flat: viably shipped a `--muted-foreground` at 72.5 Lc in light and 52.1 in
 * dark on the same verdict. Returned absolute.
 */
export declare function lc(text: Rgb, background: Rgb): number;
export interface LegibilityFailure {
    theme: Theme;
    ink: string;
    surface: string;
    ratio: number;
    required: number;
    /**
     * The token the pair was *supposed* to use, set only when it was undeclared
     * and the cascade fell through to the next link of its `var()` chain. Without
     * it a report reads as though the app chose `--primary-foreground` for its
     * brand fill, when in truth it chose nothing and CSS chose for it.
     */
    via?: string;
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
/** What a token is: a surface or mark, a label printed on it, a hue used as words. */
export interface TokenCuts {
    /** The role itself — a surface, or a mark held to 3:1 against the page. */
    fill: string;
    /**
     * The label printed *on* that fill. The only pair measured one against the
     * other rather than against the page, which is why it is the only pair a
     * swatch may print one on top of the other.
     */
    onFill?: string;
    /**
     * The same hue used as words, held to 4.5:1 against the page and never printed
     * on the fill — there it measures about 1.2:1. Always `-ink`; the categorical
     * hues shipped under `-foreground` until that was corrected, and the old names
     * survive only as aliases the ESLint rules flag.
     */
    asInk?: string;
}
/**
 * The cuts a token ships, read off the same three sets `checkSignals` measures.
 *
 * Exported so consumers do not each keep their own idea of which tokens are
 * pairs — the docs site did, and got the categorical hues wrong, rendering
 * `--ochre` as a lone square while its ink, the colour the marker highlight is
 * painted with, appeared nowhere. A palette checked against one taxonomy and
 * documented from another will drift, and the drift shows up as a page that is
 * quietly wrong rather than a build that fails.
 */
export declare function tokenCuts(token: string): TokenCuts;
/**
 * The bar a rule owes is kept separate from `checkSignals`: it is not a signal,
 * just an accessibility check. Nothing here carries meaning in its hue; it only
 * has to be seen.
 */
export declare function checkHairlines(css: string, { themes }?: {
    themes?: Theme[] | undefined;
}): LegibilityFailure[];
/**
 * The three bars a palette owes, run over the same engine as `checkLegibility`.
 * Without this the numbers in a theme's comments are claims, not measurements.
 */
export declare function checkSignals(css: string, { themes }?: {
    themes?: Theme[] | undefined;
}): LegibilityFailure[];
/** A one-line report per failure, for a test's assertion message. */
export declare function formatFailures(failures: LegibilityFailure[]): string;

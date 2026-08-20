import type { ComponentProps } from "react";
/**
 * Inks only. A fill token (`--secondary`, `--accent`) has no chroma to wash with —
 * at 44% alpha it is invisible, and the `luminosity` blend then strips the text's
 * hue for nothing. Brand hues come in through `--marker` at the call site.
 */
declare const MARKER_TONES: {
    readonly primary: "var(--primary)";
    readonly success: "var(--success)";
    readonly warn: "var(--warn)";
    readonly info: "var(--info)";
    readonly destructive: "var(--destructive)";
};
export type HighlightTone = keyof typeof MARKER_TONES;
/**
 * Marker highlight for inline text. Painted as the run's own background, never a
 * mask — a mask would shave the glyph tops. `luminosity` lets letters borrow the
 * marker's hue while keeping their own lightness, so contrast holds in both themes.
 */
export declare function Highlight({ tone, seed, className, style, children, ...props }: ComponentProps<"span"> & {
    tone?: HighlightTone;
    /** Changes the wobble and the grain of the swipe. Any integer. */
    seed?: number;
}): import("react").JSX.Element;
export {};

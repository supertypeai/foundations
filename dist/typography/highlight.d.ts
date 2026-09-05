import type { ComponentProps } from "react";
/**
 * Inks only. A fill token has no chroma to wash with, so the earth tones enter as
 * `-foreground`, the ink-grade pair. Emphasis, never status: warn, info and
 * destructive are absent on purpose.
 */
declare const MARKER_TONES: {
    readonly primary: "var(--primary)";
    readonly success: "var(--success)";
    readonly ochre: "var(--ochre-ink)";
    readonly terracotta: "var(--terracotta-ink)";
    readonly sage: "var(--sage-ink)";
    readonly fig: "var(--fig-ink)";
};
export type HighlightTone = keyof typeof MARKER_TONES;
/**
 * Marker highlight for inline text, painted as the run's own background rather
 * than a mask, which would shave the glyph tops. `luminosity` lets letters borrow
 * the marker's hue while keeping their lightness, which comes from `--marker-ink`.
 */
export declare function TypographyHighlight({ tone, seed, className, style, children, ...props }: ComponentProps<"span"> & {
    tone?: HighlightTone;
    /** Changes the wobble and the grain of the swipe. Any integer. */
    seed?: number;
}): import("react").JSX.Element;
export {};

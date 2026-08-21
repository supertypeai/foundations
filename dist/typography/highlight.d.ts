import type { ComponentProps } from "react";
/**
 * Inks only. A fill token (`--secondary`, `--accent`) has no chroma to wash with —
 * at 44% alpha it is invisible, and the `luminosity` blend then strips the text's
 * hue for nothing. That is why the earth tones enter as `-foreground`: those are
 * the ink-grade pair, mixed to hold at text weight in both themes.
 *
 * Emphasis, never status. Warn and info and destructive are absent on purpose —
 * a swipe of red under a phrase says less than the words do.
 *
 * The four earth tones are one palette, not a menu: each is a different hue,
 * because two a reader cannot tell apart are one tone with two names.
 */
declare const MARKER_TONES: {
    readonly primary: "var(--primary)";
    readonly success: "var(--success)";
    readonly ochre: "var(--ochre-foreground)";
    readonly terracotta: "var(--terracotta-foreground)";
    readonly sage: "var(--sage-foreground)";
    readonly fig: "var(--fig-foreground)";
};
export type HighlightTone = keyof typeof MARKER_TONES;
/**
 * Marker highlight for inline text. Painted as the run's own background, never a
 * mask — a mask would shave the glyph tops. `luminosity` lets letters borrow the
 * marker's hue while keeping their own lightness, so contrast holds in both themes.
 */
export declare function TypographyHighlight({ tone, seed, className, style, children, ...props }: ComponentProps<"span"> & {
    tone?: HighlightTone;
    /** Changes the wobble and the grain of the swipe. Any integer. */
    seed?: number;
}): import("react").JSX.Element;
export {};

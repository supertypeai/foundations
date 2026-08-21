import type { CSSProperties, ComponentProps } from "react";

import { cn } from "../cn.js";

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
const MARKER_TONES = {
  primary: "var(--primary)",
  success: "var(--success)",
  ochre: "var(--ochre-foreground)",
  terracotta: "var(--terracotta-foreground)",
  sage: "var(--sage-foreground)",
  fig: "var(--fig-foreground)",
} as const;

export type HighlightTone = keyof typeof MARKER_TONES;

/** Wash density at a fraction of the theme's base alpha. */
const ink = (weight: number) =>
  `color-mix(in srgb, var(--marker) calc(var(--marker-alpha) * ${weight}), transparent)`;

// One dab of the tip, in percentages so the swipe stretches with the phrase.
// They overlap by a third — that scalloping is what separates a swipe from a
// shape. The last three are the strand a felt tip pools into as it lifts.
const DABS = [
  { x: 3, y: 64, rx: 10, ry: 32, w: 0.34 },
  { x: 16, y: 61, rx: 18, ry: 37, w: 0.46 },
  { x: 31, y: 63, rx: 19, ry: 34, w: 0.44 },
  { x: 46, y: 60, rx: 19, ry: 37, w: 0.48 },
  { x: 61, y: 62, rx: 19, ry: 34, w: 0.43 },
  { x: 76, y: 59, rx: 19, ry: 36, w: 0.47 },
  { x: 89, y: 61, rx: 15, ry: 33, w: 0.4 },
  { x: 98, y: 63, rx: 8, ry: 30, w: 0.3 },
  { x: 18, y: 95.5, rx: 14, ry: 3.4, w: 0.3 },
  { x: 44, y: 97.5, rx: 18, ry: 2.8, w: 0.26 },
  { x: 68, y: 96, rx: 15, ry: 3.2, w: 0.2 },
] as const;

// Integer-only: `Math.sin` is implementation-defined, so Node and the browser
// disagreed in the last bits and the swipe hydrated as a mismatch.
const hash = (seed: number, i: number) => {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(i + 0x165667b1, 0xc2b2ae35);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2545f491);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
};

/** Rounding keeps the string identical across engines. */
const q = (n: number) => Math.round(n * 100) / 100;
const q4 = (n: number) => Math.round(n * 10000) / 10000;

/** Deterministic noise in [-1, 1], so `seed` reshapes a swipe without a random source. */
const drift = (seed: number, i: number) => hash(seed, i) * 2 - 1;

/** `drift` remapped to a range, for the values that are a size rather than an offset. */
const between = (seed: number, i: number, lo: number, hi: number) =>
  lo + hash(seed, i) * (hi - lo);

// Grain is drag, not noise. Bounds keep streaks inside the wash — one clearing
// the feathered edge reads as dirt.
const STREAKS = 9;

const streak = (seed: number, k: number) => {
  const i = 100 + k * 7; // Stride, so neighbouring streaks draw on unrelated noise.
  const x = q(between(seed, i, 16, 82));
  const y = q(between(seed, i + 1, 44, 86));
  const rx = q(between(seed, i + 2, 10, 27));
  const ry = q(between(seed, i + 3, 1.3, 3.1));
  const w = q4(between(seed, i + 4, 0.07, 0.14));
  return `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${ink(w)} 0 58%, transparent 100%)`;
};

const fillCache = new Map<number, string>();

const markerFill = (seed: number) => {
  const cached = fillCache.get(seed);
  if (cached) return cached;
  // Streaks first: later layers paint under earlier ones.
  const fill = [
    ...Array.from({ length: STREAKS }, (_, k) => streak(seed, k)),
    ...DABS.map(({ x, y, rx, ry, w }, i) => {
      // Wobble scales with the dab; a flat offset would relocate the strand.
      const cy = q(y + drift(seed, i) * Math.min(4, ry * 0.4));
      const r = q(rx + drift(seed, i + DABS.length) * 2);
      return `radial-gradient(ellipse ${r}% ${ry}% at ${x}% ${cy}%, ${ink(w)} 0 56%, ${ink(w * 0.45)} 82%, transparent 100%)`;
    }),
  ].join(", ");
  fillCache.set(seed, fill);
  return fill;
};

/**
 * Marker highlight for inline text. Painted as the run's own background, never a
 * mask — a mask would shave the glyph tops. `luminosity` lets letters borrow the
 * marker's hue while keeping their own lightness, so contrast holds in both themes.
 */
export function TypographyHighlight({
  tone = "primary",
  seed = 3,
  className,
  style,
  children,
  ...props
}: ComponentProps<"span"> & {
  tone?: HighlightTone;
  /** Changes the wobble and the grain of the swipe. Any integer. */
  seed?: number;
}) {
  return (
    <span
      className={cn(
        "isolate inline px-[0.3em] py-[0.06em]",
        "[-webkit-box-decoration-break:clone] [box-decoration-break:clone]",
        "[--marker-alpha:44%] dark:[--marker-alpha:58%]",
        className,
      )}
      style={
        {
          "--marker": MARKER_TONES[tone],
          backgroundImage: markerFill(seed),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span className="[mix-blend-mode:luminosity]">{children}</span>
    </span>
  );
}

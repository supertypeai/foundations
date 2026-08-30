import { FOCUS_RING } from "./focus.js";
/**
 * The segmented picker, as one set of surfaces.
 *
 * Two components draw this control and neither can absorb the other: `Tabs` is Base UI's
 * compositional Tabs, driven by a `value` and marking its own trigger with `data-active`,
 * while a consumer's marketing picker is a data-driven `items`/`index` control that paints
 * the active state onto a separate absolutely-positioned pill so `motion` can slide it.
 * Same design, two mechanisms. Before this file they were two hand-synced copies of the same
 * class strings, which is exactly the kind of duplication that drifts the first time
 * someone retunes the palette.
 *
 * The active segment is deliberately flat — a card surface and a hairline, no shadow.
 * Elevation in this system means "this layer left the page plane" (see --elevation-* in
 * theme.css), and a segment sitting inside its own track has not.
 *
 * The other half of that: the segment stays on the page plane because the RAIL drops below
 * it. The well is the shadow and the hairline, not a fill — the track is `bg-background`
 * pressed in. A `--muted` rail cannot work, because `--muted` sits below `--card` in light
 * and above it in dark, so a muted fill reads correct in one theme and inverted in the
 * other, and `dark:` is what the package's own ESLint rule exists to stop.
 */
export const SEGMENT = {
    /**
     * The rail a set of segments sits in. Surface only; each component owns its layout.
     *
     * `rounded-md` over `activeSurface`'s `rounded-sm` is the 2px of `p-0.5`: concentric
     * radii, so the segment's corner runs parallel to the rail's rather than across it.
     */
    track: "rounded-md border border-border bg-background p-0.5 shadow-recessed",
    /** Affordances every segment shares, whatever its shape or engine. */
    item: `relative inline-flex items-center gap-1.5 font-medium transition-colors ${FOCUS_RING}`,
    /** Selected: the ink lifts to full strength. */
    active: "text-foreground",
    /**
     * Unselected: quiet, but lighting its own surface on hover so the whole strip reads as
     * reachable rather than only the segment already chosen. It moves toward `activeSurface`
     * and not toward the rail, so a hover previews being picked.
     */
    idle: "text-muted-foreground hover:bg-card/60 hover:text-foreground",
    /**
     * The flat surface marking the selection. One string, worn by both engines: the marketing
     * picker slides it with `motion`, `Tabs` hands it to the element Base UI positions.
     */
    activeSurface: "rounded-sm bg-card ring-1 ring-border",
};

import { FOCUS_RING } from "./focus.js";
/**
 * The segmented picker, as one set of surfaces, previously two hand-synced copies
 * of the same class strings. The active segment is flat on purpose: elevation
 * means a layer left the page plane, and a segment inside its track has not. The
 * well is the shadow and the hairline, since `--muted` inverts between themes.
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

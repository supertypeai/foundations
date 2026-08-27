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
 * Some entries appear twice, once bare and once `data-active:`-prefixed. That is not
 * laziness: Tailwind generates a utility only if it appears literally in scanned source, so
 * prefixing at runtime would compile to classes that never got built. Writing both forms
 * side by side is the honest version, and it keeps the pair impossible to change by half.
 *
 * The active segment is deliberately flat — a card surface and a hairline, no shadow.
 * Elevation in this system means "this layer left the page plane" (see --elevation-* in
 * theme.css), and a segment sitting inside its own track has not.
 */
export const SEGMENT = {
    /** The rail a set of segments sits in. Surface only; each component owns its layout. */
    track: "rounded-lg border border-border bg-muted/40 p-0.5",
    /** Affordances every segment shares, whatever its shape or engine. */
    item: "relative inline-flex items-center gap-1.5 font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
    /** Selected: the ink lifts to full strength. */
    active: "text-foreground",
    /**
     * Unselected: quiet, but lighting its own surface on hover so the whole strip reads as
     * reachable rather than only the segment already chosen.
     */
    idle: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    /** The flat surface marking the selection. */
    activeSurface: "bg-card ring-1 ring-border",
    /** `activeSurface`, for an engine that marks its own trigger with `data-active`. */
    dataActiveSurface: "data-active:bg-card data-active:text-foreground data-active:ring-1 data-active:ring-border",
};

/**
 * The small bordered control in the header bar. Shared because there are now
 * two kinds of them — the surface toggles and the star link — and a second copy
 * of the string is how the two would drift apart.
 */
export const PILL =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-2 py-[3px] leading-none text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-muted/50 hover:text-foreground active:translate-y-px";

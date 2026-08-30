import {
  cn,
  TypographyCaption,
  TypographyH4,
  TypographyHighlight,
  TypographyInlineCode,
  TypographyProse,
  type HighlightTone,
} from "@supertype.ai/foundations";

/**
 * The editorial palette in the two places it belongs: a swipe under a phrase,
 * and a mark that says which kind of thing this is. Neither is a control — a
 * button reads a `Tone`, and none of these hues is one.
 *
 * Two APIs, because the palette is not evenly reachable:
 *
 *   `TypographyHighlight` takes four of the eight as a `tone` prop. The other
 *   four are absent from it deliberately — a marker wants hues a reader can tell
 *   apart at a glance, and moss beside fern is one tone with two names.
 *
 *   All eight are registered as Tailwind colours in `theme.css`, so `bg-moss`
 *   and `text-moss-ink` work anywhere. That is how the four the highlight turns
 *   down still earn their place.
 */

/** Exactly the four the marker paints with. Named here so the demo cannot claim
 *  a tone the type does not have. */
const MARKER: readonly HighlightTone[] = ["ochre", "terracotta", "sage", "fig"];

/** The other four, reachable as utilities only. Both classes are written out per
 *  row rather than built from the name: Tailwind scans for literals, and a
 *  `bg-${name}` it cannot read is a class it does not generate.
 *
 *  `-ink` is the hue used as words. `-foreground` is the deprecated spelling for
 *  the same colour and the lint rules flag it. */
const CATEGORIES = [
  { label: "Infrastructure", dot: "bg-moss", ink: "text-moss-ink" },
  { label: "Databases", dot: "bg-fern", ink: "text-fern-ink" },
  { label: "Tooling", dot: "bg-stone", ink: "text-stone-ink" },
  { label: "Field notes", dot: "bg-cocoa", ink: "text-cocoa-ink" },
] as const;

export default function EditorialInks() {
  return (
    <div className="space-y-8">
      <div>
        <TypographyH4>Emphasis, in prose</TypographyH4>
        <TypographyProse className="mt-2">
          A swipe carries {" "}
          <TypographyHighlight tone="ochre">weight, not state</TypographyHighlight>{" "}
          — there is no <TypographyInlineCode>warn</TypographyInlineCode> or{" "}
          <TypographyInlineCode>destructive</TypographyInlineCode> marker,
          because a stroke of red under a phrase says less than the words do.
        </TypographyProse>
        <TypographyProse className="mt-3">
          Four of the eight hues are markers:{" "}
          {MARKER.map((tone, i) => (
            <span key={tone}>
              <TypographyHighlight tone={tone} seed={i * 5}>
                {tone}
              </TypographyHighlight>
              {i < MARKER.length - 1 ? ", " : ""}
            </span>
          ))}
          . Pass a <TypographyInlineCode>seed</TypographyInlineCode> to redraw the
          swipe without changing the hue.
        </TypographyProse>
      </div>

      <div>
        <TypographyH4>Kind, as a mark</TypographyH4>
        <TypographyCaption as="p" className="mt-2">
          The four the marker turns down, spent as utilities. Identity, never
          status, so these say what a thing is — not how it is going.
        </TypographyCaption>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, dot, ink }) => (
            <li key={label}>
              <span className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-2 text-xs font-medium">
                <span aria-hidden className={cn("size-2 rounded-full", dot)} />
                <span className={ink}>{label}</span>
              </span>
            </li>
          ))}
        </ul>
        <TypographyCaption as="p" className="mt-4">
          <TypographyInlineCode>bg-moss</TypographyInlineCode> paints the dot and{" "}
          <TypographyInlineCode>text-moss-ink</TypographyInlineCode> the words:
          the fill is a mark at 3:1, the ink is read at 4.5:1, and no hue here
          prints a label on its own fill. The ink is{" "}
          <TypographyInlineCode>-ink</TypographyInlineCode>;{" "}
          <TypographyInlineCode>-foreground</TypographyInlineCode> is the
          deprecated spelling and still resolves, so the lint rules are what stop
          it surviving the rename.
        </TypographyCaption>
      </div>
    </div>
  );
}

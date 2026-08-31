import {
  cn,
  TypographyCaption,
  TypographyH4,
  TypographyHighlight,
  TypographyInlineCode,
  TypographyProse,
  type HighlightTone,
} from "@supertype.ai/foundations";

const MARKER: readonly HighlightTone[] = ["ochre", "terracotta", "sage", "fig"];

const SEEDS = [3, 7, 12, 41] as const;

const CATEGORIES = [
  { label: "Infrastructure", dot: "bg-moss", ink: "text-moss-ink" },
  { label: "Databases", dot: "bg-fern", ink: "text-fern-ink" },
  { label: "Tooling", dot: "bg-stone", ink: "text-stone-ink" },
  { label: "Field notes", dot: "bg-cocoa", ink: "text-cocoa-ink" },
] as const;

const PILL = cn(
  "flex items-center gap-2 rounded-full border border-border",
  "py-1 pr-3 pl-2 text-xs font-medium",
);

export default function EditorialInks() {
  return (
    <div className="space-y-8">
      <div>
        <TypographyH4>Emphasis, in prose</TypographyH4>
        <TypographyProse className="mt-2">
          A <TypographyInlineCode>TypographyHighlight</TypographyInlineCode>{" "}
          component paints a marker swipe behind a run of text. The four earth
          tones (
          {MARKER.map((tone, i) => (
            <span key={tone}>
              <TypographyHighlight tone={tone} seed={i * 5}>
                {tone}
              </TypographyHighlight>
              {i < MARKER.length - 1 ? ", " : ""}
            </span>
          ))}
          ) are the only hues that can hold at text weight in both themes, so
          these are the choices along with{" "}
          <TypographyInlineCode>primary</TypographyInlineCode> and{" "}
          <TypographyInlineCode>success</TypographyInlineCode>. The{" "}
          <TypographyInlineCode>seed</TypographyInlineCode> (optional) changes
          the wobble and the grain of the swipe.
        </TypographyProse>
      </div>

      <div>
        <TypographyH4>Kind, as a mark</TypographyH4>
        <TypographyCaption as="p" className="mt-2">
          The four the marker turns down, spent as utilities. Identity rather
          than status: they say what a thing is.
        </TypographyCaption>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, dot, ink }) => (
            <li key={label}>
              <span className={PILL}>
                <span aria-hidden className={cn("size-2 rounded-full", dot)} />
                <span className={ink}>{label}</span>
              </span>
            </li>
          ))}
        </ul>
        <TypographyCaption as="p" className="mt-4">
          <TypographyInlineCode>bg-moss</TypographyInlineCode> paints the dot
          and <TypographyInlineCode>text-moss-ink</TypographyInlineCode> the
          words. The fill is a mark at 3:1 and the ink is read at 4.5:1, so
          labels sit beside a fill here instead of on it.
        </TypographyCaption>
      </div>
    </div>
  );
}

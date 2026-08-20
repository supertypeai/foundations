"use client";

import { Rail, RailLink } from "./rail.js";
import { useScrollSpy } from "./scroll.js";
import type { EssayIndexEntry } from "./essay.js";

/**
 * The margin index, with the section you are in marked. Separate from
 * `EssayLayout` so only this nav crosses the client boundary.
 */
export function TableOfContents({
  sections,
  label = "On this page",
}: {
  sections: readonly EssayIndexEntry[];
  /** The rail's own heading. Set it to `null` to render the links alone. */
  label?: React.ReactNode;
}) {
  const active = useScrollSpy(sections.map((s) => s.id));

  // Nothing to index is nothing to render: an empty list would still draw the
  // label and the rail's hairline in the margin. `ReadingRail` bails the same
  // way. Placed after the hook so the call order never changes.
  if (sections.length === 0) return null;

  return (
    <nav aria-label="Page sections">
      {label ? (
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      ) : null}
      <Rail>
        {sections.map(({ id, label: text }) => (
          <RailLink key={id} href={`#${id}`} active={active === id}>
            {text}
          </RailLink>
        ))}
      </Rail>
    </nav>
  );
}
